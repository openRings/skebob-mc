use chrono::{DateTime, Utc};
use sqlx::FromRow;

#[derive(FromRow, Clone)]
pub struct InviteUse {
    id: u64,
    invite_id: u64,
    used_by: u64,
    used_at: DateTime<Utc>,
}
