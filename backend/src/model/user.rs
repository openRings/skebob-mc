use anyhow::Context;
use bcrypt::Version;
use chrono::{DateTime, Utc};
use sha2::Digest;
use sqlx::FromRow;

use super::session::{NewSession, Session};
use crate::database::Database;

#[derive(FromRow, Clone, Debug)]
pub struct User {
    id: i64,
    nickname: String,
    password_hash: String,
    max_invites: i32,
    created_at: DateTime<Utc>,
}

impl User {
    pub fn validate_password(&self, password: &str) -> anyhow::Result<bool> {
        bcrypt::verify(password, &self.password_hash).context("failed to hash password")
    }

    pub async fn create(
        nickname: &str,
        password: &str,
        database: &Database,
    ) -> anyhow::Result<u64> {
        let password_hash = bcrypt::hash_with_result(password, 10)
            .context("failed to hash password")?
            .format_for_version(Version::TwoA);

        let last_id = sqlx::query("INSERT INTO users(nickname, password_hash) VALUES (?, ?)")
            .bind(nickname)
            .bind(password_hash)
            .execute(database.pool())
            .await
            .context("failed to insert")?
            .last_insert_id();

        Ok(last_id)
    }

    pub async fn from_nickname(
        nickname: &str,
        database: &Database,
    ) -> anyhow::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM users WHERE nickname = ?")
            .bind(nickname)
            .fetch_optional(database.pool())
            .await
            .context("failed to fetch")
    }

    pub async fn from_access_token(
        token: &str,
        database: &Database,
    ) -> anyhow::Result<Option<Self>> {
        let access_token_hash = format!("{:x}", sha2::Sha256::digest(token));

        sqlx::query_as(
            "SELECT * FROM users
            JOIN active_sessions ON users.id = active_sessions.user_id
            WHERE access_token_hash = ?",
        )
        .bind(access_token_hash)
        .fetch_optional(database.pool())
        .await
        .context("failed to fetch")
    }

    pub async fn generate_session(&self, database: &Database) -> anyhow::Result<NewSession> {
        Session::generate_for(self.id, database)
            .await
            .context("failed to generate session")
    }
}
