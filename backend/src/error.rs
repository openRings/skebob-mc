use axum::body::Body;
use axum::extract::Request;
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

pub enum EndpointError {
    BadRequest(String),
    Unauthorized,
    ServerError(anyhow::Error),
}

#[derive(Clone)]
enum Logging {
    Error(String),
    Warn(String),
}

pub async fn error_logging_middleware(req: Request, next: Next) -> Response {
    let uri = req.uri().clone();

    let resp = next.run(req).await;

    if let Some(logging) = resp.extensions().get::<Logging>() {
        match logging {
            Logging::Error(err) => tracing::error!("endpoint {} error: {}", uri, err),
            Logging::Warn(message) => tracing::warn!("endpoint {} warn: {}", uri, message),
        }
    }

    resp
}

impl IntoResponse for EndpointError {
    fn into_response(self) -> Response {
        let error = |status: StatusCode, message: &str, logging: Option<Logging>| {
            let mut response = Response::builder()
                .status(status)
                .header("Content-Type", "application/json")
                .body(Body::new(
                    serde_json::json!({ "error": message }).to_string(),
                ))
                .expect("response must be valid");

            if let Some(logging) = logging {
                response.extensions_mut().insert(logging);
            }

            response
        };

        match self {
            Self::Unauthorized => StatusCode::UNAUTHORIZED.into_response(),
            Self::BadRequest(message) => error(StatusCode::BAD_REQUEST, &message, None),
            Self::ServerError(err) => error(
                StatusCode::INTERNAL_SERVER_ERROR,
                "Сервис временно недоступен",
                Some(Logging::Error(format!("{err:?}"))),
            ),
        }
    }
}

impl From<anyhow::Error> for EndpointError {
    fn from(value: anyhow::Error) -> Self {
        Self::ServerError(value)
    }
}
