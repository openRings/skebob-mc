use anyhow::Context;
use chrono::{DateTime, Utc};
use sqlx::FromRow;

use super::session::{NewSession, Session};
use crate::database::Database;

#[derive(FromRow, Clone, Debug)]
pub struct User {
    id: u64,
    nickname: String,
    password_hash: String,
    max_invites: u16,
    created_at: DateTime<Utc>,
}

impl User {
    pub fn id(&self) -> u64 {
        self.id
    }

    pub fn nickname(&self) -> &str {
        &self.nickname
    }

    pub fn max_invites(&self) -> u16 {
        self.max_invites
    }

    pub fn created_at(&self) -> DateTime<Utc> {
        self.created_at
    }

    pub fn validate_password(&self, password: &str) -> anyhow::Result<bool> {
        bcrypt::verify(password, &self.password_hash).context("failed to hash password")
    }
}
