use anyhow::Context;
use uuid::Uuid;

use crate::core::Operation;
use crate::database::Database;

pub struct UserPluginCreateCommand {
    database: Database,
}

impl Operation for UserPluginCreateCommand {
    fn new(database: Database) -> Self {
        Self { database }
    }
}

impl UserPluginCreateCommand {
    const PLUGIN_TABLE_NAME: &str = "librepremium_data";
    const ALGO: &str = "BCrypt-2A";

    pub async fn execute(
        &self,
        uuid: Uuid,
        nickname: &str,
        hashed_password: &str,
        salt: &str,
    ) -> anyhow::Result<()> {
        sqlx::query(
            format!(
                "INSERT INTO {}(uuid, hashed_password, salt, algo, last_nickname)
                VALUES (?, ?, ?, ?, ?)",
                Self::PLUGIN_TABLE_NAME
            )
            .as_str(),
        )
        .bind(uuid.to_string())
        .bind(hashed_password)
        .bind(salt)
        .bind(Self::ALGO)
        .bind(nickname)
        .execute(self.database.pool())
        .await
        .context("failed to execute")?;

        Ok(())
    }
}
