use anyhow::Context;

use crate::core::Operation;
use crate::database::Database;
use crate::model::dto::InviteInfo;

pub struct InviteInfoQuery {
    database: Database,
}

impl InviteInfoQuery {
    pub async fn execute(&self, code: &str) -> anyhow::Result<Option<InviteInfo>> {
        sqlx::query_as(
            "SELECT u.nickname AS created_by, uu.nickname AS used_by FROM invites i
            JOIN users u ON i.created_by = u.id
            LEFT JOIN invite_uses iu ON iu.invite_id = i.id
            LEFT JOIN users uu ON iu.used_by = uu.id
            WHERE i.code = ?",
        )
        .bind(code)
        .fetch_optional(self.database.pool())
        .await
        .context("failed to fetch")
    }
}

impl Operation for InviteInfoQuery {
    fn new(database: Database) -> Self {
        Self { database }
    }
}
