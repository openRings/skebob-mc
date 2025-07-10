use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;

#[derive(FromRow, Clone, Serialize)]
pub struct InviteWithUsage {
    name: Option<String>,
    code: String,
    created_at: DateTime<Utc>,
    used_by: Option<String>,
}
