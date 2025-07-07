use anyhow::Context;
use axum::Router;
use axum::body::Body;
use axum::extract::FromRequestParts;
use axum::http::StatusCode;
use axum::http::header::{AUTHORIZATION, CONTENT_TYPE, SET_COOKIE};
use axum::http::request::Parts;
use axum::response::{IntoResponse, Response};
use axum::routing::post;
use axum_cookie::cookie::Cookie;

use crate::database::Database;
use crate::error::EndpointError;
use crate::model::session::NewSession;
use crate::model::user::User;

mod renewal;
mod signin;
mod signup;

pub fn get_nest() -> Router<Database> {
    Router::new()
        .route("/signup", post(signup::signup))
        .route("/signin", post(signin::signin))
        .route("/renewal", post(renewal::renewal))
}

impl IntoResponse for NewSession {
    fn into_response(self) -> Response {
        let mut refresh_cookie = Cookie::builder("refresh-token", self.refresh_token().to_owned())
            .path("/api/auth/renewal")
            .http_only(true)
            .build();

        if !cfg!(debug_assertions) {
            refresh_cookie.set_secure(true);
        }

        let body = Body::new(
            serde_json::json!({
                "accessToken": self.access_token()
            })
            .to_string(),
        );

        Response::builder()
            .status(StatusCode::OK)
            .header(SET_COOKIE, refresh_cookie.to_string())
            .header(CONTENT_TYPE, "application/json")
            .body(body)
            .expect("must be valid")
    }
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
