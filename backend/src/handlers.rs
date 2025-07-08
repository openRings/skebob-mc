use axum::{Router, middleware::from_fn};
use axum_cookie::CookieLayer;

use crate::database::Database;

mod auth;
mod error;
mod invites;
mod profile;

pub fn create_router(state: Database) -> Router {
    Router::new()
        .nest("/invites", invites::get_nest())
        .nest("/profile", profile::get_nest())
        .merge(auth::get_nest())
        .layer(from_fn(error::error_logging_middleware))
        .layer(CookieLayer::strict())
        .with_state(state)
}
