//! Middleware to extract authorization data from the authtoken in the header

use iron::headers::{Authorization, Bearer};
use iron::prelude::*;
use iron::{status, BeforeMiddleware};
use jsonwebtoken::{decode, DecodingKey, Validation};

use crate::env::JWT_SECRET;
use crate::error::StringError;
use crate::rest::authtoken::Claims;

/// Middleware that wraps a handler, returning a static file in the case of a file-not-found error.
pub struct VerifyJWT;

impl VerifyJWT {
    pub fn new() -> Self {
        Self {}
    }
}

impl BeforeMiddleware for VerifyJWT {
    fn before(&self, request: &mut Request<'_, '_>) -> IronResult<()> {
        if let Some(auth) = request.headers.get::<Authorization<Bearer>>() {
            let claims = decode::<Claims>(
                &auth.token,
                &DecodingKey::from_secret(JWT_SECRET.as_bytes()),
                &Validation::default(),
            )
            .map_err(|err| IronError::new(StringError(err.to_string()), status::Unauthorized))?;
            request.extensions.insert::<Claims>(claims.claims);
            Ok(())
        } else {
            Err(IronError::new(
                StringError("Authorization header is invalid".to_string()),
                status::Unauthorized,
            ))
        }
    }
}
