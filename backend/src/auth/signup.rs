use anyhow::Context;
use axum::Json;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;

use crate::database::Database;
use crate::error::EndpointError;
use crate::model::user::User;

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

    if let Some(_user) = User::from_nickname(&nickname, &database)
        .await
        .with_context(|| format!("failed to search by nickname: {nickname}"))?
    {
        tracing::warn!("tries to register existed nickname: {}", nickname);

        return Err(EndpointError::BadRequest(format!(
            "Ник {nickname} уже существует",
        )));
    }

    User::create(&nickname, &password, &database)
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
