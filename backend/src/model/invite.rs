use sqlx::FromRow;

#[derive(FromRow, Clone)]
pub struct Invite {
    // id: u64,
    // created_by: u64,
    // code: String,
    // created_at: DateTime<Utc>,
}
