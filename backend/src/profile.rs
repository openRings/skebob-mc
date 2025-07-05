use axum::Router;
use axum::response::IntoResponse;
use axum::routing::get;

use crate::database::Database;
use crate::model::user::User;

pub fn get_nest() -> Router<Database> {
    Router::new().route("/", get(profile))
}

async fn profile(user: User) -> impl IntoResponse {
    format!("you: {user:#?}")
}
