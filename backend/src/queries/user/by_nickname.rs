use anyhow::Context;

use crate::{database::Executor, model::user::User};

pub struct UserByNickname;

impl UserByNickname {
    pub async fn execute<'a>(
        nickname: &str,
        executor: impl Executor<'a>,
    ) -> anyhow::Result<Option<User>> {
        sqlx::query_as("SELECT * FROM users WHERE nickname = ?")
            .bind(nickname)
            .fetch_optional(executor)
            .await
            .context("failed to fetch")
    }
}
