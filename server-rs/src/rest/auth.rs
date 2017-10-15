//! Handles authentication and re-authentication of users using JWT authentication.
//! This is the only part of the API that is exposed to unauthenticated users.

use iron::prelude::*;
use iron::{status, Handler, Chain};
use iron::typemap::Key;
use router::Router;
use params::{Params, Value};
use jwt::{encode, decode, Header};
use bcrypt;
use database::Database;
use middleware::VerifyJWT;
use cr;

pub const JWT_SECRET: &'static str = "FAKE_SECRET_KEY";

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub usr: i32,
}
impl Key for Claims { type Value = Claims; }

struct ReAuth { database: Database }
impl Handler for ReAuth {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let claims = req.extensions.get::<Claims>();
        let authtoken = itry! { encode(&Header::default(), &claims, JWT_SECRET.as_ref()) };
        return cr::ok(authtoken);
    }
}

struct Auth { database: Database }
impl Handler for Auth {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = itry!{ req.get_ref::<Params>(), status::BadRequest };
        let usr = iexpect!{ params.get("usr") };
        let psw = iexpect!{ params.get("psw") };

        if let (&Value::String(ref email), &Value::String(ref password)) = (usr, psw) {
            let usr = iexpect!{ self.database.get_user_for_email(email), status::Unauthorized };
            if itry! { bcrypt::verify(password, usr.password.as_str()) } {
                // TODO: get a real secret key
                let authtoken = itry! { encode(&Header::default(), &Claims{ usr: usr.user_id }, JWT_SECRET.as_ref()) };
                return cr::ok(authtoken)
            }
        }
        cr::fail("Invalid credentials")
    }
}

pub fn new(db: Database) -> Router {
    let mut router = Router::new();

    router
        .get("/", chain![ VerifyJWT::new(); ReAuth{ database: db.clone() } ], "reauth")
        .post("/", Auth{ database: db.clone() }, "auth");

    router
}
