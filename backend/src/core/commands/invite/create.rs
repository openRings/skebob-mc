use anyhow::Context;

use crate::core::Operation;
use crate::database::Database;

pub struct InviteCreateCommand {
    database: Database,
}

impl Operation for InviteCreateCommand {
    fn new(database: Database) -> Self {
        Self { database }
    }
}

impl InviteCreateCommand {
    pub async fn execute(
        &self,
        name: Option<&str>,
        creator_id: u64,
        code: &str,
    ) -> anyhow::Result<()> {
        sqlx::query("INSERT INTO invites(name, created_by, code) VALUES (?, ?, ?)")
            .bind(name)
            .bind(creator_id)
            .bind(code)
            .execute(self.database.pool())
            .await
            .context("failed to execute")?;

        Ok(())
    }
}
