use anyhow::Context;
use axum::Json;
use axum::extract::State;
use axum::response::IntoResponse;
use axum_cookie::CookieManager;
use axum_cookie::cookie::Cookie;

use crate::database::Database;
use crate::error::EndpointError;
use crate::model::user::User;

#[derive(serde::Deserialize)]
pub struct SigninBody {
    nickname: String,
    password: String,
}

pub async fn signin(
    State(database): State<Database>,
    cookie: CookieManager,
    Json(body): Json<SigninBody>,
) -> Result<impl IntoResponse, EndpointError> {
    let SigninBody { nickname, password } = body;

    let user = User::from_nickname(&nickname, &database)
        .await
        .with_context(|| format!("failed to get by nickname: {nickname}"))?;

    if let Some(ref user) = user
        && user.validate_password(&password)?
    {
        let session = user
            .generate_session(&database)
            .await
            .with_context(|| format!("failed to generate session for: {nickname}"))?;

        tracing::info!("user signed: {}", nickname);

        let mut refresh_cookie =
            Cookie::builder("refresh-token", session.refresh_token().to_owned())
                .http_only(true)
                .path("/api/auth/renewal")
                .build();

        if !cfg!(debug_assertions) {
            refresh_cookie.set_secure(true);
        }

        cookie.set(refresh_cookie);

        return Ok(Json(serde_json::json!({
            "accessToken": session.access_token()
        })));
    } else if user.is_some() {
        tracing::warn!("try to signin with wrong password: {nickname}")
    } else {
        tracing::warn!("try to signin to unknown user: {nickname}")
    }

    Err(EndpointError::Unauthorized)
}
