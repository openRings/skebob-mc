use anyhow::Context;
use axum::Router;
use tokio::net::TcpListener;

use crate::database::Database;

mod auth;
mod database;
mod error;
mod model;
mod profile;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let database = Database::new()?;

    sqlx::migrate!()
        .run(&*database)
        .await
        .context("failed to migrate")?;

    let router = Router::new()
        .nest("/profile", profile::get_nest())
        .merge(auth::get_nest())
        .with_state(database);

    let listener = TcpListener::bind("0.0.0.0:80")
        .await
        .context("failed to bind tcp listener")?;

    axum::serve(listener, router)
        .await
        .context("failed to serve")?;

    Ok(())
}
