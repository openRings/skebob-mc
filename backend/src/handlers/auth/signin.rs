use anyhow::Context;
use axum::Json;
use axum::extract::State;
use axum::response::IntoResponse;

use crate::commands::SessionCreateCommand;
use crate::database::Database;
use crate::handlers::error::EndpointError;
use crate::model::NewSession;
use crate::queries::UserByNickname;

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

    let user = UserByNickname::execute(&nickname, database.pool())
        .await
        .with_context(|| format!("failed to get by nickname: {nickname}"))?;

    if let Some(ref user) = user
        && user.validate_password(&password)?
    {
        let session = NewSession::new(user.id());

        SessionCreateCommand::execute(&session, database.pool())
            .await
            .with_context(|| format!("failed to create session for user: {nickname}"))?;

        tracing::info!("user signed: {nickname}");

        return Ok(session);
    } else if user.is_some() {
        tracing::warn!("try to signin with wrong password: {nickname}")
    } else {
        tracing::warn!("try to signin to unknown user: {nickname}")
    }

    Err(EndpointError::Unauthorized)
}
