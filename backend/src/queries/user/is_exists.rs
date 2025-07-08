use anyhow::Context;

use crate::database::Executor;

pub struct IsUserExistsQuery;

impl IsUserExistsQuery {
    pub async fn execute<'a>(nickname: &str, executor: impl Executor<'a>) -> anyhow::Result<bool> {
        let row: Option<()> = sqlx::query_as("SELECT id FROM users WHERE nickname = ?")
            .bind(nickname)
            .fetch_optional(executor)
            .await
            .context("failed to fetch")?;

        Ok(row.is_some())
    }
}
