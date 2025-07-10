use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow, Clone, Serialize)]
pub struct InviteWithUsage {
    code: String,
    created_at: DateTime<Utc>,
    used_by: Option<String>,
}
