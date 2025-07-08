use anyhow::Context;
use axum::extract::State;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};

use super::error::EndpointError;
use crate::database::Database;
use crate::model::user::User;
use crate::queries::user::profile::UserProfileQuery;

pub fn get_nest() -> Router<Database> {
    Router::new().route("/", get(profile))
}

async fn profile(
    State(database): State<Database>,
    user: User,
) -> Result<impl IntoResponse, EndpointError> {
    let profile = UserProfileQuery::execute(user.id(), database.pool())
        .await
        .with_context(|| format!("failed to get profile for user: {}", user.nickname()))?
        .expect("user must be exists");

    Ok(Json(profile))
}
