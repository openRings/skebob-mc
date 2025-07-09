use anyhow::Context;

use crate::core::Operation;
use crate::database::Database;
use crate::model::Invite;

pub struct InviteAvaliableQuery {
    database: Database,
}

impl Operation for InviteAvaliableQuery {
    fn new(database: Database) -> Self {
        Self { database }
    }
}

impl InviteAvaliableQuery {
    pub async fn execute(&self, code: &str) -> anyhow::Result<Option<Invite>> {
        sqlx::query_as("SELECT * FROM avaliable_invites WHERE code = ?")
            .bind(code)
            .fetch_optional(self.database.pool())
            .await
            .context("failed to fetch")
    }
}
