use anyhow::Context;
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use axum::{Json, Router};
use base64::Engine;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use serde::Deserialize;

use crate::commands::{InviteCreateCommand, InviteUseCommand};
use crate::core::Op;
use crate::database::Database;
use crate::handlers::EndpointError;
use crate::model::User;
use crate::queries::{
    InviteAvaliableQuery, InviteInfoQuery, InviteListQuery, InviteRemainedQuery, UserProfileQuery,
};

const CODE_BYTES_LEN: usize = 8;

pub fn get_nest() -> Router<Database> {
    Router::new()
        .route("/", post(create_invite).get(get_my_invites))
        .route("/{code}", post(use_invite).get(get_invite_info))
}

async fn get_my_invites(
    Op(invite_list): Op<InviteListQuery>,
    user: User,
) -> Result<impl IntoResponse, EndpointError> {
    let invites = invite_list
        .execute(user.id())
        .await
        .with_context(|| format!("failed to get invites for user: {}", user.nickname()))?;

    Ok(Json(invites))
}

#[derive(Clone, Deserialize)]
pub struct CreateInviteBody {
    name: Option<String>,
}

async fn create_invite(
    Op(invite_create): Op<InviteCreateCommand>,
    Op(invite_remained): Op<InviteRemainedQuery>,
    user: User,
    Json(body): Json<CreateInviteBody>,
) -> Result<impl IntoResponse, EndpointError> {
    let CreateInviteBody { name } = body;

    let invite_remained = invite_remained
        .execute(user.id())
        .await
        .with_context(|| {
            format!(
                "failed to get invites remained for user: {}",
                user.nickname()
            )
        })?
        .expect("user must be exists");

    if !invite_remained.can_invite {
        return Err(EndpointError::Forbidden(
            "Создание приглашений доступно только приглашенным пользователям".to_owned(),
        ));
    }

    if invite_remained.remained == 0 {
        return Err(EndpointError::Forbidden(
            "Лимит приглашений исчерпан".to_owned(),
        ));
    }

    let code_bytes = rand::random::<[u8; CODE_BYTES_LEN]>();
    let code = URL_SAFE_NO_PAD.encode(code_bytes);

    invite_create
        .execute(name.as_deref(), user.id(), &code)
        .await
        .with_context(|| format!("failed to create invite for user: {}", user.nickname()))?;

    Ok(Json(serde_json::json!({
        "code": code
    })))
}

async fn use_invite(
    Path(code): Path<String>,
    user: User,
    Op(user_profile): Op<UserProfileQuery>,
    Op(invite_avaliable): Op<InviteAvaliableQuery>,
    Op(invite_use): Op<InviteUseCommand>,
) -> Result<impl IntoResponse, EndpointError> {
    let invite = invite_avaliable
        .execute(&code)
        .await
        .with_context(|| format!("failed to get invite by code: {code}"))?
        .ok_or(EndpointError::NotFound)?;

    let profile = user_profile
        .execute(user.id())
        .await
        .with_context(|| format!("failed to get profile of user: {}", user.nickname()))?
        .with_context(|| format!("user must be exists, but does not: {}", user.nickname()))?;

    if profile.invited.is_some() {
        return Err(EndpointError::Forbidden(
            "Вы уже приняли приглашение".to_owned(),
        ));
    }

    invite_use
        .execute(invite.id(), user.id())
        .await
        .with_context(|| {
            format!(
                "failed to use invite with code: {code}, by: {}",
                user.nickname()
            )
        })?;

    Ok(StatusCode::OK)
}

async fn get_invite_info(
    Path(code): Path<String>,
    Op(invite_info): Op<InviteInfoQuery>,
) -> Result<impl IntoResponse, EndpointError> {
    let invite_info = invite_info
        .execute(&code)
        .await
        .with_context(|| format!("failed to get invite info by code: {code}"))?
        .ok_or(EndpointError::NotFound)?;

    Ok(Json(invite_info))
}
