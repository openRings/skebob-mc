use anyhow::Context;
use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use bcrypt::Version;

use crate::commands::UserCreateCommand;
use crate::database::Database;
use crate::handlers::error::EndpointError;
use crate::queries::UserByNickname;

#[derive(serde::Deserialize)]
pub struct SignupBody {
    nickname: String,
    password: String,
    password_repeat: String,
}

pub async fn signup(
    State(database): State<Database>,
    Json(body): Json<SignupBody>,
) -> Result<impl IntoResponse, EndpointError> {
    let SignupBody {
        nickname,
        password,
        password_repeat,
    } = body;

    if let Err(message) = validate_passwords(&password, &password_repeat) {
        return Err(EndpointError::BadRequest(message.to_string()));
    }

    if let Some(_user) = UserByNickname::execute(&nickname, database.pool())
        .await
        .with_context(|| format!("failed to check is user exists by nickname: {nickname}"))?
    {
        tracing::warn!("tries to register existed nickname: {}", nickname);

        return Err(EndpointError::BadRequest(format!(
            "Ник {nickname} уже используется",
        )));
    }

    let password_hash = bcrypt::hash_with_result(password, 10)
        .context("failed to hash password")?
        .format_for_version(Version::TwoA);

    UserCreateCommand::execute(&nickname, &password_hash, database.pool())
        .await
        .with_context(|| format!("failed to create user: {nickname}"))?;

    tracing::info!("created user: {}", nickname);

    Ok(StatusCode::CREATED)
}

fn validate_passwords(password: &str, password_repeat: &str) -> Result<(), &'static str> {
    if password != password_repeat {
        return Err("Пароли должны совпадать");
    }

    if password.len() < 8 {
        return Err("Длина пароля должна быть не менее 8 символов");
    }

    if password.to_lowercase() == password || password.to_uppercase() == password {
        return Err("Пароль должен содержать минимум одну заглавную и прописную букву");
    }

    if !password.chars().any(|c| c.is_ascii_digit()) {
        return Err("Пароль должен содержать хотя бы одну цифру");
    }

    Ok(())
}
