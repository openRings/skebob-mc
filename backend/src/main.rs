use anyhow::Context;
use axum::Router;
use axum::middleware::from_fn;
use axum_cookie::CookieLayer;
use tokio::net::TcpListener;

use crate::database::Database;

mod auth;
mod database;
mod error;
mod model;
mod profile;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt().init();

    let database = Database::new()?;

    sqlx::migrate!()
        .run(&*database)
        .await
        .context("failed to migrate")?;

    tracing::info!("database migration success");

    let router = Router::new()
        .nest("/profile", profile::get_nest())
        .merge(auth::get_nest())
        .layer(from_fn(error::error_logging_middleware))
        .layer(CookieLayer::strict())
        .with_state(database);

    let listener = TcpListener::bind("0.0.0.0:80")
        .await
        .context("failed to bind tcp listener")?;

    tracing::info!("server listening: {:?}", listener.local_addr().unwrap());

    axum::serve(listener, router)
        .await
        .context("failed to serve")?;

    Ok(())
}
