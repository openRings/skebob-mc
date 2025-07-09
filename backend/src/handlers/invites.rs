use anyhow::Context;
use axum::response::IntoResponse;
use axum::routing::post;
use axum::{Json, Router};
use base64::Engine;
use base64::engine::general_purpose::STANDARD_NO_PAD;

use crate::commands::InviteCreateCommand;
use crate::core::Op;
use crate::database::Database;
use crate::handlers::EndpointError;
use crate::model::User;
use crate::queries::InviteRemainedQuery;

const CODE_BYTES_LEN: usize = 8;

pub fn get_nest() -> Router<Database> {
    Router::new().route("/", post(create_invite))
}

async fn create_invite(
    Op(invite_create): Op<InviteCreateCommand>,
    Op(invite_remained): Op<InviteRemainedQuery>,
    user: User,
) -> Result<impl IntoResponse, EndpointError> {
    let invite_remained = invite_remained
        .execute(user.id())
        .await
        .with_context(|| {
            format!(
                "failed to get invites remained for user: {}",
                user.nickname()
            )
        })?
        .expect("user must be exists");

    if !invite_remained.can_invite {
        return Err(EndpointError::Forbidden(
            "Создание приглашений доступно только приглашенным пользователям".to_owned(),
        ));
    }

    if invite_remained.remained == 0 {
        return Err(EndpointError::Forbidden(
            "Лимит приглашений исчерпан".to_owned(),
        ));
    }

    let code_bytes = rand::random::<[u8; CODE_BYTES_LEN]>();
    let code = STANDARD_NO_PAD.encode(code_bytes);

    invite_create
        .execute(user.id(), &code)
        .await
        .with_context(|| format!("failed to create invite for user: {}", user.nickname()))?;

    Ok(Json(serde_json::json!({
        "code": code
    })))
}
