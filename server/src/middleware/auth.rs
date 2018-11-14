//! Middleware to extract authorization data from the authtoken in the header

use iron::prelude::*;
use iron::headers::{Authorization, Bearer};
use iron::{BeforeMiddleware, status};
use jwt::{decode, Validation};

use rest::authtoken::Claims;
use error::StringError;
use crate::env::JWT_SECRET; 

/// Middleware that wraps a handler, returning a static file in the case of a file-not-found error.
pub struct VerifyJWT;
impl VerifyJWT {
    pub fn new() -> Self { Self{} }
}
impl BeforeMiddleware for VerifyJWT {
    fn before(&self, request: &mut Request) -> IronResult<()> {
        if let Some(auth) = request.headers.get::<Authorization<Bearer>>() {
            let claims = decode::<Claims>(&auth.token, JWT_SECRET.as_ref(), &Validation::default())
                .map_err(|err| IronError::new(StringError(err.description().to_string()), status::Unauthorized))?;
            request.extensions.insert::<Claims>(claims.claims);
            Ok(())
        } else {
            Err(IronError::new(StringError("Authorization header is invalid".to_string()), status::Unauthorized))
        }
    }
}
