use crate::env::JWT_SECRET;
use chrono::{Duration, Utc};
use iron::typemap::Key;
use jsonwebtoken::{encode, errors::Error, Header};
use serde::{Deserialize, Serialize};

#[derive(Copy, Clone, Serialize, Deserialize, Debug)]
pub struct Claims {
    pub usr: i32,
    exp: i64,
}
impl Key for Claims {
    type Value = Claims;
}

pub fn new(usr: i32) -> Result<String, Error> {
    let exp = Utc::now() + Duration::days(90);
    with_claims(&Claims {
        usr,
        exp: exp.timestamp(),
    })
}

pub fn updating_claims(claims: &Claims) -> Result<String, Error> {
    let exp = Utc::now() + Duration::days(90);
    let claims = Claims {
        exp: exp.timestamp(),
        ..*claims
    };
    encode(&Header::default(), &claims, JWT_SECRET.as_ref())
}

fn with_claims(claims: &Claims) -> Result<String, Error> {
    encode(&Header::default(), claims, JWT_SECRET.as_ref())
}
