use axum::Router;
use axum::middleware::from_fn;
use axum::routing::get;
use axum_cookie::CookieLayer;
use axum_prometheus::PrometheusMetricLayerBuilder;

use crate::database::Database;

pub use self::error::EndpointError;

mod auth;
mod error;
mod invites;
mod profile;

pub fn create_router(state: Database) -> Router {
    let (metric_layer, metric_handle) = PrometheusMetricLayerBuilder::new()
        .enable_response_body_size(true)
        .with_default_metrics()
        .build_pair();

    Router::new()
        .nest("/invites", invites::get_nest())
        .nest("/profile", profile::get_nest())
        .merge(auth::get_nest())
        .route("/metrics", get(|| async move { metric_handle.render() }))
        .layer(from_fn(error::error_logging_middleware))
        .layer(CookieLayer::strict())
        .layer(metric_layer)
        .with_state(state)
}
