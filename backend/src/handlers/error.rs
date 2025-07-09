use axum::body::Body;
use axum::extract::Request;
use axum::http::StatusCode;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

pub enum EndpointError {
    BadRequest(String),
    Forbidden(String),
    Unauthorized,
    NotFound,
    ServerError(anyhow::Error),
}

#[derive(Clone)]
enum Logging {
    Error(String),
}

pub async fn error_logging_middleware(req: Request, next: Next) -> Response {
    let uri = req.uri().clone();

    let resp = next.run(req).await;

    if let Some(logging) = resp.extensions().get::<Logging>() {
        match logging {
            Logging::Error(err) => tracing::error!("endpoint {} error: {}", uri, err),
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
            Self::NotFound => StatusCode::NOT_FOUND.into_response(),
            Self::BadRequest(message) => error(StatusCode::BAD_REQUEST, &message, None),
            Self::Forbidden(message) => error(StatusCode::FORBIDDEN, &message, None),
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
