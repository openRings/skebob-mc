use anyhow::Context;
use sqlx::FromRow;

#[derive(FromRow, Clone, Debug)]
pub struct User {
    id: u64,
    nickname: String,
    password_hash: String,
    // max_invites: u16,
    // created_at: DateTime<Utc>,
}

impl User {
    pub fn id(&self) -> u64 {
        self.id
    }

    pub fn nickname(&self) -> &str {
        &self.nickname
    }

    pub fn validate_password(&self, password: &str) -> anyhow::Result<bool> {
        bcrypt::verify(password, &self.password_hash).context("failed to hash password")
    }
}
