use anyhow::Context;

use crate::database::Executor;

pub struct InviteCreateCommand;

impl InviteCreateCommand {
    pub async fn execute<'a>(
        creator_id: u64,
        code: &str,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<()> {
        sqlx::query("INSERT INTO invites(created_by, code) VALUES (?, ?)")
            .bind(creator_id)
            .bind(code)
            .execute(executor)
            .await
            .context("failed to execute")?;

        Ok(())
    }
}
