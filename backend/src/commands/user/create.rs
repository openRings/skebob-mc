use anyhow::Context;

use crate::database::Executor;

pub struct UserCreateCommand;

impl UserCreateCommand {
    pub async fn execute<'a>(
        nickname: &str,
        password_hash: &str,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<()> {
        sqlx::query("INSERT INTO users(nickname, password_hash) VALUES (?, ?)")
            .bind(nickname)
            .bind(password_hash)
            .execute(executor)
            .await
            .context("failed to execute")?;

        Ok(())
    }
}
