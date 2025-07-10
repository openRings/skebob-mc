use anyhow::Context;

use crate::core::Operation;
use crate::database::Database;
use crate::model::dto::InviteWithUsage;

pub struct InviteListQuery {
    database: Database,
}

impl Operation for InviteListQuery {
    fn new(database: Database) -> Self {
        Self { database }
    }
}

impl InviteListQuery {
    pub async fn execute(&self, user_id: u64) -> anyhow::Result<Vec<InviteWithUsage>> {
        sqlx::query_as(
            "SELECT i.name, i.code, i.created_at, u.nickname AS used_by FROM invites i
            LEFT JOIN invite_uses iu ON iu.invite_id = i.id
            LEFT JOIN users u ON u.id = iu.used_by
            WHERE i.created_by = ?",
        )
        .bind(user_id)
        .fetch_all(self.database.pool())
        .await
        .context("failed to fetch")
    }
}
