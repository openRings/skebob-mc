use axum::extract::FromRequestParts;
use axum::http::request::Parts;

use crate::database::Database;

pub mod commands;
pub mod queries;

pub trait Operation {
    fn new(database: Database) -> Self;
}

pub struct Op<T: Operation>(pub T);

impl<T: Operation> FromRequestParts<Database> for Op<T> {
    type Rejection = ();

    async fn from_request_parts(
        _parts: &mut Parts,
        state: &Database,
    ) -> Result<Self, Self::Rejection> {
        Ok(Self(T::new(state.clone())))
    }
}
