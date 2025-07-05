use anyhow::Context;
use chrono::Duration;
use rand::Rng;
use sha2::{Digest, Sha256};

use crate::database::Database;

#[derive(Clone)]
pub struct Session;

#[derive(Clone)]
pub struct NewSession {
    access_token: String,
    refresh_token: String,
}

impl Session {
    const DEFAULT_SESSION_DURATION: i64 = Duration::days(31).num_seconds();

    pub async fn generate_for(user_id: u64, database: &Database) -> anyhow::Result<NewSession> {
        let new_session = NewSession::new();

        let access_token_hash = format!("{:x}", Sha256::digest(new_session.access_token()));
        let refresh_token_hash = format!("{:x}", Sha256::digest(new_session.refresh_token()));

        sqlx::query(
            "INSERT INTO sessions(access_token_hash, refresh_token_hash, user_id, duration)
            VALUES (?, ?, ?, ?)",
        )
        .bind(access_token_hash)
        .bind(refresh_token_hash)
        .bind(user_id)
        .bind(Self::DEFAULT_SESSION_DURATION)
        .execute(database.pool())
        .await
        .context("failed to execute")?;

        Ok(new_session)
    }
}

impl NewSession {
    pub fn new() -> Self {
        let mut rng = rand::rng();

        let access_token_bytes = rng.random::<[u8; 32]>();
        let refresh_token_bytes = rng.random::<[u8; 32]>();

        let access_token = hex::encode(access_token_bytes);
        let refresh_token = hex::encode(refresh_token_bytes);

        Self {
            access_token,
            refresh_token,
        }
    }

    pub fn access_token(&self) -> &str {
        &self.access_token
    }

    pub fn refresh_token(&self) -> &str {
        &self.refresh_token
    }
}
