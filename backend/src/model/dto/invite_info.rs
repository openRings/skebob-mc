use serde::Serialize;
use sqlx::FromRow;

#[derive(Serialize, FromRow)]
pub struct InviteInfo {
    created_by: String,
    used_by: Option<String>,
}
