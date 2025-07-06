use anyhow::Context;
use chrono::{DateTime, Utc};
use sqlx::FromRow;

use crate::database::Database;

#[derive(FromRow, Clone)]
pub struct InviteUse {
    id: u64,
    invite_id: u64,
    used_by: u64,
    used_at: DateTime<Utc>,
}

impl InviteUse {
    pub fn used_at(&self) -> DateTime<Utc> {
        self.used_at
    }

    pub async fn from_user_id(id: u64, database: &Database) -> anyhow::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM invite_uses WHERE used_by = ?")
            .bind(id)
            .fetch_optional(database.pool())
            .await
            .context("failed to fetch")
    }
}
