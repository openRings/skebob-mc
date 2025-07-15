use anyhow::Context;
use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use bcrypt::Version;
use uuid::Uuid;

use crate::commands::{UserCreateCommand, UserPluginCreateCommand};
use crate::core::Op;
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
    Op(user_plugin_create): Op<UserPluginCreateCommand>,
    Json(body): Json<SignupBody>,
) -> Result<impl IntoResponse, EndpointError> {
    let SignupBody {
        nickname,
        password,
        password_repeat,
    } = body;

    if let Err(message) = validate_nickname(&nickname) {
        return Err(EndpointError::BadRequest(message.to_string()));
    }

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

    // TODO: maybe move that logic from handler
    let password_hash = bcrypt::hash_with_result(password, 12)
        .context("failed to hash password")?
        .format_for_version(Version::TwoA);

    let uuid = Uuid::new_v4();

    let password_hash_rest = password_hash
        .split('$')
        .nth(3)
        .with_context(|| format!("failed to get password hash rest: {password_hash}"))?;

    let hash_salt = &password_hash_rest[..22];
    let hashed_password = format!("12${}", &password_hash_rest[22..]);

    user_plugin_create
        .execute(uuid, &nickname, &hashed_password, hash_salt)
        .await
        .with_context(|| format!("failed to create user in plugin: {nickname}"))?;

    UserCreateCommand::execute(&nickname, &password_hash, database.pool())
        .await
        .with_context(|| format!("failed to create user: {nickname}"))?;

    tracing::info!("created user: {}", nickname);

    Ok(StatusCode::CREATED)
}

fn validate_nickname(nickname: &str) -> Result<(), &'static str> {
    if nickname.len() < 3 || nickname.len() > 16 {
        return Err("Длина ника должна быть от 3 до 16 символов");
    }

    if !nickname
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '_')
    {
        return Err("Ник может содержать только латинские буквы, цифры и подчёркивание");
    }

    if nickname.chars().all(|c| c.is_ascii_digit()) {
        return Err("Ник не может состоять только из цифр");
    }

    Ok(())
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
