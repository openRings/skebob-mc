use anyhow::Context;

use crate::database::Executor;

pub struct SessionDeleteCommand;

impl SessionDeleteCommand {
    pub async fn execute<'a>(session_id: u64, executor: impl Executor<'a>) -> anyhow::Result<()> {
        sqlx::query("DELETE FROM sessions WHERE id = ?")
            .bind(session_id)
            .execute(executor)
            .await
            .context("failed to execute")?;

        Ok(())
    }
}
