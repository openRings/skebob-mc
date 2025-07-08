use anyhow::Context;
use axum::extract::State;
use axum::response::IntoResponse;
use axum_cookie::CookieManager;
use sha2::{Digest, Sha256};

use crate::commands::session::create::SessionCreateCommand;
use crate::commands::session::detele::SessionDeleteCommand;
use crate::database::Database;
use crate::handlers::error::EndpointError;
use crate::model::session::NewSession;
use crate::queries::session::by_refresh::SessionByRefreshQuery;

pub async fn renewal(
    State(database): State<Database>,
    cookie: CookieManager,
) -> Result<impl IntoResponse, EndpointError> {
    let refresh_token_cookie = cookie
        .get("refresh-token")
        .ok_or(EndpointError::Unauthorized)?;

    let refresh_token = refresh_token_cookie.value();
    let refresh_token_hash = format!("{:x}", Sha256::digest(refresh_token));

    let old_session = SessionByRefreshQuery::execute(&refresh_token_hash, database.pool())
        .await
        .with_context(|| {
            format!(
                "failed to get session from refresh token for renewal, refresh token hash: {refresh_token_hash}",
            )
        })?
        .ok_or(EndpointError::Unauthorized)?;

    let mut transaction = database
        .pool()
        .begin()
        .await
        .context("failed to begin transaction")?;

    SessionDeleteCommand::execute(old_session.id(), &mut *transaction)
        .await
        .with_context(|| format!("failed to delete session with id: {}", old_session.id()))?;

    let new_session = NewSession::new(old_session.user_id());

    SessionCreateCommand::execute(&new_session, &mut *transaction)
        .await
        .with_context(|| {
            format!(
                "failed to create session for user id: {}",
                old_session.user_id()
            )
        })?;

    transaction
        .commit()
        .await
        .context("failed to commit transaction")?;

    Ok(new_session)
}
