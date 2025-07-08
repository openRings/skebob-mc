use anyhow::Context;

use crate::database::Executor;
use crate::model::user::User;

pub struct UserByTokenQuery;

impl UserByTokenQuery {
    pub async fn execute<'a>(
        access_token_hash: &str,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<Option<User>> {
        sqlx::query_as(
            "SELECT u.id, u.nickname, u.password_hash, u.max_invites, u.created_at
            FROM users u
            JOIN active_sessions s ON u.id = s.user_id
            WHERE s.access_token_hash = ?",
        )
        .bind(access_token_hash)
        .fetch_optional(executor)
        .await
        .context("failed to fetch")
    }
}
