use anyhow::Context;
use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;

use crate::database::Executor;

#[derive(FromRow, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserProfile {
    nickname: String,
    max_invites: u16,
    created_at: DateTime<Utc>,
    invited: Option<DateTime<Utc>>,
}

pub struct UserProfileQuery;

impl UserProfileQuery {
    pub async fn execute<'a>(
        user_id: u64,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<Option<UserProfile>> {
        sqlx::query_as(
            "SELECT u.nickname, u.max_invites, u.created_at, i.used_at as invited
            FROM users u
            LEFT JOIN invite_uses i ON u.id = i.used_by
            WHERE u.id = ?",
        )
        .bind(user_id)
        .fetch_optional(executor)
        .await
        .context("failed to fetch")
    }
}
