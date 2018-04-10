use iron::typemap::Key;
use jwt::{encode, Header};
use jwt::errors::Error;

// TODO: get a real secret key
pub const JWT_SECRET: &'static str = "FAKE_SECRET_KEY";

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
