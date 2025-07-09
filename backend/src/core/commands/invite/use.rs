use anyhow::Context;

use crate::core::Operation;
use crate::database::Database;

pub struct InviteUseCommand {
    database: Database,
}

impl Operation for InviteUseCommand {
    fn new(database: Database) -> Self {
        Self { database }
    }
}

impl InviteUseCommand {
    pub async fn execute(&self, invite_id: u64, user_id: u64) -> anyhow::Result<()> {
        sqlx::query("INSERT INTO invite_uses(invite_id, used_by) VALUES (?, ?)")
            .bind(invite_id)
            .bind(user_id)
            .execute(self.database.pool())
            .await
            .context("failed to execute")?;

        Ok(())
    }
}
