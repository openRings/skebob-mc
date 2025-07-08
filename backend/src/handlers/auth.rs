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
use sha2::{Digest, Sha256};

use crate::database::Database;
use crate::handlers::error::EndpointError;
use crate::model::NewSession;
use crate::model::User;
use crate::queries::UserByTokenQuery;

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
            .path("/api/renewal")
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
        let access_token_hash = format!("{:x}", Sha256::digest(access_token));

        let user = UserByTokenQuery::execute(&access_token_hash, state.pool())
            .await
            .with_context(|| {
                format!("failed to get user from access token, token hash: {access_token_hash}",)
            })?
            .ok_or(EndpointError::Unauthorized)?;

        Ok(user)
    }
}
