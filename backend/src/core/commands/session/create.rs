use anyhow::Context;
use chrono::Duration;

use crate::database::Executor;
use crate::model::NewSession;

const DEFAULT_ACCESS_TOKEN_DURATION: i64 = Duration::hours(3).num_seconds();
const DEFAULT_REFRESH_TOKEN_DURATION: i64 = Duration::days(31).num_seconds();

pub struct SessionCreateCommand;

impl SessionCreateCommand {
    pub async fn execute<'a>(
        new_session: &NewSession,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<()> {
        sqlx::query(
            "INSERT INTO sessions(access_token_hash, refresh_token_hash, user_id, access_duration, refresh_duration)
            VALUES (?, ?, ?, ?, ?)",
        )
        .bind(new_session.access_token_hash())
        .bind(new_session.refresh_token_hash())
        .bind(new_session.user_id())
        .bind(DEFAULT_ACCESS_TOKEN_DURATION)
        .bind(DEFAULT_REFRESH_TOKEN_DURATION)
        .execute(executor)
        .await
        .context("failed to execute")?;

        Ok(())
    }
}
