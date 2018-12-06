use iron::typemap::Key;
use jsonwebtoken::{errors::Error, encode, Header};
use serde_derive::{Serialize, Deserialize};
use crate::env::JWT_SECRET;

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub usr: i32,
}
impl Key for Claims { type Value = Claims; }

pub fn new(usr: i32) -> Result<String, Error> {
    with_claims(&Claims { usr })
}

pub fn with_claims(claims: &Claims) -> Result<String, Error> {
    encode(&Header::default(), claims, JWT_SECRET.as_ref())
}
