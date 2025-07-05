use anyhow::Context;
use axum::Json;
use axum::extract::State;
use axum::response::IntoResponse;

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
    Json(body): Json<SigninBody>,
) -> Result<impl IntoResponse, EndpointError> {
    let SigninBody { nickname, password } = body;

    let user = User::get_by_nickname(&nickname, &database)
        .await
        .with_context(|| format!("failed to get by nickname: {nickname}"))?;

    if let Some(ref user) = user
        && user.validate_password(&password)?
    {
        tracing::info!("user signed: {}", nickname);

        return Ok(Json(serde_json::json!({ "accessToken": "123" })));
    } else if user.is_some() {
        tracing::warn!("try to signin with wrong password: {nickname}")
    } else {
        tracing::warn!("try to signin to unknown user: {nickname}")
    }

    Err(EndpointError::Unauthorized)
}
