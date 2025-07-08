use anyhow::Context;

use crate::database::Executor;
use crate::model::Session;

pub struct SessionByRefreshQuery;

impl SessionByRefreshQuery {
    pub async fn execute<'a>(
        refresh_token_hash: &str,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<Option<Session>> {
        sqlx::query_as("SELECT * FROM avaliable_sessions WHERE refresh_token_hash = ?")
            .bind(refresh_token_hash)
            .fetch_optional(executor)
            .await
            .context("failed to fetch")
    }
}
