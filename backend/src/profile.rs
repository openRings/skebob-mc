use axum::Router;

use crate::database::Database;

pub fn get_nest() -> Router<Database> {
    Router::new()
}
