use anyhow::Context;
use base64::Engine;
use base64::engine::general_purpose::STANDARD_NO_PAD;
use chrono::{DateTime, Utc};
use sqlx::FromRow;

use crate::database::Database;

#[derive(FromRow, Clone)]
pub struct Invite {
    id: u64,
    created_by: u64,
    code: String,
    created_at: DateTime<Utc>,
}

impl Invite {
    const CODE_BYTES_LEN: usize = 8;

    pub async fn create(by: u64, database: &Database) -> anyhow::Result<String> {
        let code_bytes = rand::random::<[u8; Self::CODE_BYTES_LEN]>();
        let code = STANDARD_NO_PAD.encode(code_bytes);

        sqlx::query("INSERT INTO invites(created_by, code) VALUES (?, ?)")
            .bind(by)
            .bind(&code)
            .execute(database.pool())
            .await
            .context("failed to execute")?;

        Ok(code)
    }
}
