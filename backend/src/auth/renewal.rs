use anyhow::Context;
use axum::{extract::State, response::IntoResponse};
use axum_cookie::CookieManager;

use crate::database::Database;
use crate::error::EndpointError;
use crate::model::session::Session;

pub async fn renewal(
    State(database): State<Database>,
    cookie: CookieManager,
) -> Result<impl IntoResponse, EndpointError> {
    let refresh_token_cookie = cookie
        .get("refresh-token")
        .ok_or(EndpointError::Unauthorized)?;

    let refresh_token = refresh_token_cookie.value();

    let old_session = Session::from_refresh_token(refresh_token, &database)
        .await
        .with_context(|| {
            format!(
                "failed to get session from refresh token: ..{}",
                refresh_token.chars().rev().take(6).collect::<String>()
            )
        })?
        .ok_or(EndpointError::Unauthorized)?;

    let new_session = old_session
        .renewal(&database)
        .await
        .with_context(|| format!("failed to renewal session: {}", old_session.id()))?;

    Ok(new_session)
}
