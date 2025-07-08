use anyhow::Context;
use serde::Serialize;
use sqlx::FromRow;

use crate::database::Executor;

#[derive(FromRow, Clone, Serialize)]
pub struct InvitesRemained {
    pub can_invite: bool,
    pub remained: u16,
}

pub struct InvitesRemainedQuery;

impl InvitesRemainedQuery {
    pub async fn execute<'a>(
        user_id: u64,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<Option<InvitesRemained>> {
        sqlx::query_as("SELECT * FROM user_invites_remained WHERE id = ?")
            .bind(user_id)
            .fetch_optional(executor)
            .await
            .context("failed to fetch")
    }
}
