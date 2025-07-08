use anyhow::Context;
use axum::extract::State;
use axum::response::IntoResponse;
use axum::routing::post;
use axum::{Json, Router};
use base64::Engine;
use base64::engine::general_purpose::STANDARD_NO_PAD;

use crate::commands::InviteCreateCommand;
use crate::database::Database;
use crate::handlers::EndpointError;
use crate::model::User;
use crate::queries::InvitesRemainedQuery;

const CODE_BYTES_LEN: usize = 8;

pub fn get_nest() -> Router<Database> {
    Router::new().route("/", post(create_invite))
}

async fn create_invite(
    State(database): State<Database>,
    user: User,
) -> Result<impl IntoResponse, EndpointError> {
    let invites_remained = InvitesRemainedQuery::execute(user.id(), database.pool())
        .await
        .with_context(|| {
            format!(
                "failed to get invites remained for user: {}",
                user.nickname()
            )
        })?
        .expect("user must be exists");

    if !invites_remained.can_invite {
        return Err(EndpointError::Forbidden(
            "Создание приглашений доступно только пришлашеным игрокам".to_owned(),
        ));
    }

    if invites_remained.remained == 0 {
        return Err(EndpointError::Forbidden(
            "Лимит приглашений исчерпан".to_owned(),
        ));
    }

    let code_bytes = rand::random::<[u8; CODE_BYTES_LEN]>();
    let code = STANDARD_NO_PAD.encode(code_bytes);

    InviteCreateCommand::execute(user.id(), &code, database.pool())
        .await
        .with_context(|| format!("failed to create invite for user: {}", user.nickname()))?;

    Ok(Json(serde_json::json!({
        "code": code
    })))
}
