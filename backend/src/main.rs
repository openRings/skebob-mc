use anyhow::Context;
use tokio::net::TcpListener;

use self::database::Database;

pub use self::core::commands;
pub use self::core::queries;

mod core;
mod database;
mod handlers;
mod model;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt().init();

    let database = Database::new()?;

    sqlx::migrate!()
        .run(database.pool())
        .await
        .context("failed to migrate")?;

    tracing::info!("database migration success");

    let router = handlers::create_router(database);

    let listener = TcpListener::bind("0.0.0.0:80")
        .await
        .context("failed to bind tcp listener")?;

    tracing::info!("server listening: {:?}", listener.local_addr().unwrap());

    axum::serve(listener, router)
        .await
        .context("failed to serve")?;

    Ok(())
}
