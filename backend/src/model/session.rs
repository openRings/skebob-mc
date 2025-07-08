use anyhow::Context;
use chrono::{DateTime, Duration, Utc};
use rand::Rng;
use sha2::{Digest, Sha256};
use sqlx::prelude::FromRow;

use crate::database::Database;

#[derive(FromRow, Clone)]
pub struct Session {
    id: u64,
    access_token_hash: String,
    refresh_token_hash: String,
    user_id: u64,
    access_duration: Duration,
    refresh_duration: Duration,
    created_at: DateTime<Utc>,
}

#[derive(Clone)]
pub struct NewSession {
    user_id: u64,
    access_token: String,
    refresh_token: String,
}

impl Session {
    pub fn id(&self) -> u64 {
        self.id
    }

    pub fn user_id(&self) -> u64 {
        self.user_id
    }

    pub async fn from_refresh_token(
        token: &str,
        database: &Database,
    ) -> anyhow::Result<Option<Self>> {
        let refresh_token_hash = format!("{:x}", sha2::Sha256::digest(token));

        sqlx::query_as("SELECT * FROM avaliable_sessions WHERE refresh_token_hash = ?")
            .bind(refresh_token_hash)
            .fetch_optional(database.pool())
            .await
            .context("failed to fetch")
    }
}

impl NewSession {
    pub fn new(user_id: u64) -> Self {
        let mut rng = rand::rng();

        let access_token_bytes = rng.random::<[u8; 32]>();
        let refresh_token_bytes = rng.random::<[u8; 32]>();

        let access_token = hex::encode(access_token_bytes);
        let refresh_token = hex::encode(refresh_token_bytes);

        Self {
            user_id,
            access_token,
            refresh_token,
        }
    }

    pub fn user_id(&self) -> u64 {
        self.user_id
    }

    pub fn access_token(&self) -> &str {
        &self.access_token
    }

    pub fn refresh_token(&self) -> &str {
        &self.refresh_token
    }

    pub fn access_token_hash(&self) -> String {
        format!("{:x}", Sha256::digest(self.access_token()))
    }

    pub fn refresh_token_hash(&self) -> String {
        format!("{:x}", Sha256::digest(self.refresh_token()))
    }
}
