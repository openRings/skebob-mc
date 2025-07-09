use anyhow::Context;
use serde::Serialize;
use sqlx::FromRow;

use crate::core::Operation;
use crate::database::Database;

#[derive(FromRow, Clone, Serialize)]
pub struct InvitesRemained {
    pub can_invite: bool,
    pub remained: u16,
}

pub struct InviteRemainedQuery {
    database: Database,
}

impl Operation for InviteRemainedQuery {
    fn new(database: Database) -> Self {
        Self { database }
    }
}

impl InviteRemainedQuery {
    pub async fn execute(&self, user_id: u64) -> anyhow::Result<Option<InvitesRemained>> {
        sqlx::query_as("SELECT * FROM user_invites_remained WHERE id = ?")
            .bind(user_id)
            .fetch_optional(self.database.pool())
            .await
            .context("failed to fetch")
    }
}
