use anyhow::Context;
use axum::Router;
use sqlx::MySqlPool;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let database_pool = MySqlPool::connect_lazy("mysql://root:root@database:3306/minecraft")
        .context("failed to initialize database pool")?;

    sqlx::migrate!()
        .run(&database_pool)
        .await
        .context("failed to migrate")?;

    let router = Router::new().with_state(database_pool);

    let listener = TcpListener::bind("0.0.0.0:80")
        .await
        .context("failed to bind tcp listener")?;

    axum::serve(listener, router)
        .await
        .context("failed to serve")?;

    Ok(())
}
