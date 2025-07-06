use anyhow::Context;
use axum::extract::State;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use chrono::{DateTime, Utc};

use crate::database::Database;
use crate::error::EndpointError;
use crate::model::invite_use::InviteUse;
use crate::model::user::User;

pub fn get_nest() -> Router<Database> {
    Router::new().route("/", get(profile))
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetProfileResponse {
    nickname: String,
    max_invites: u16,
    created_at: DateTime<Utc>,
    invited: Option<DateTime<Utc>>,
}

async fn profile(
    State(database): State<Database>,
    user: User,
) -> Result<impl IntoResponse, EndpointError> {
    let invite_use = InviteUse::from_user_id(user.id(), &database)
        .await
        .with_context(|| format!("failed to get invite use for user: {}", user.nickname()))?;

    Ok(Json(GetProfileResponse::from((&user, invite_use.as_ref()))))
}

impl From<(&User, Option<&InviteUse>)> for GetProfileResponse {
    fn from((user, invite): (&User, Option<&InviteUse>)) -> Self {
        Self {
            nickname: user.nickname().to_owned(),
            max_invites: user.max_invites(),
            created_at: user.created_at(),
            invited: invite.map(|i| i.used_at()),
        }
    }
}
