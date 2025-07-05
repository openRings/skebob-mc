use crate::database::Database;
use axum::Router;
use axum::routing::post;

mod signup;

pub fn get_nest() -> Router<Database> {
    Router::new().route("/signup", post(signup::signup))
}
