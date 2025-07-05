use anyhow::Context;
use axum::Router;
use axum::extract::FromRequestParts;
use axum::http::header::AUTHORIZATION;
use axum::http::request::Parts;
use axum::routing::post;

use crate::database::Database;
use crate::error::EndpointError;
use crate::model::user::User;

mod signin;
mod signup;

pub fn get_nest() -> Router<Database> {
    Router::new()
        .route("/signup", post(signup::signup))
        .route("/signin", post(signin::signin))
}

impl FromRequestParts<Database> for User {
    type Rejection = EndpointError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Database,
    ) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get(AUTHORIZATION)
            .ok_or(EndpointError::Unauthorized)?
            .to_str()
            .map_err(|e| EndpointError::BadRequest(e.to_string()))?
            .to_lowercase();

        if !auth_header.starts_with("bearer ") {
            return Err(EndpointError::BadRequest(
                "Неизвестный тип токена".to_string(),
            ));
        }

        let access_token = auth_header.trim_start_matches("bearer").trim();

        let user = User::from_access_token(access_token, state)
            .await
            .with_context(|| {
                format!(
                    "failed to get user from access token: ..{}",
                    access_token.chars().rev().take(6).collect::<String>()
                )
            })?
            .ok_or(EndpointError::Unauthorized)?;

        Ok(user)
    }
}
