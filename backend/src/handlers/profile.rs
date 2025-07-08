use anyhow::Context;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};

use super::error::EndpointError;
use crate::core::Op;
use crate::database::Database;
use crate::model::User;
use crate::queries::UserProfileQuery;

pub fn get_nest() -> Router<Database> {
    Router::new().route("/", get(profile))
}

async fn profile(
    Op(user_profile_query): Op<UserProfileQuery>,
    user: User,
) -> Result<impl IntoResponse, EndpointError> {
    let profile = user_profile_query
        .execute(user.id())
        .await
        .with_context(|| format!("failed to get profile for user: {}", user.nickname()))?
        .expect("user must be exists");

    Ok(Json(profile))
}
