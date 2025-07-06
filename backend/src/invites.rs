use anyhow::Context;
use axum::extract::State;
use axum::response::IntoResponse;
use axum::routing::post;
use axum::{Json, Router};
use chrono::{DateTime, Utc};

use crate::database::Database;
use crate::error::EndpointError;
use crate::model::invite::Invite;
use crate::model::user::User;

pub fn get_nest() -> Router<Database> {
    Router::new().route("/", post(create_invite))
}

#[derive(serde::Serialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CreateInviteResponse {
    code: String,
    created_at: DateTime<Utc>,
}

async fn create_invite(
    State(database): State<Database>,
    user: User,
) -> Result<impl IntoResponse, EndpointError> {
    let invites_remained = user.invites_remained(&database).await.with_context(|| {
        format!(
            "failed to get remained invites for user: {}",
            user.nickname()
        )
    })?;

    if invites_remained == 0 {
        return Err(EndpointError::BadRequest(
            "Лимит приглашений исчерпан".to_owned(),
        ));
    }

    let code = Invite::create(user.id(), &database)
        .await
        .with_context(|| format!("failed to generate invite for: {}", user.nickname()))?;

    Ok(Json(serde_json::json!({
        "code": code
    })))
}
