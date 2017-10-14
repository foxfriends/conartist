//! Handles authentication and re-authentication of users using JWT authentication.
//! This is the only part of the API that is exposed to unauthenticated users.

use iron::prelude::*;
use iron::status;
use router::Router;
use params::{Params, Value};
use jwt::{encode, decode, Header};
use bcrypt;
use json;

use database;
use cr;

#[derive(Serialize, Deserialize)]
struct Claims {
    usr: usize,
}

fn reauth(req: &mut Request) -> IronResult<Response> {
    let authtoken = "";
    cr::ok("ok!")
}

fn auth(req: &mut Request) -> IronResult<Response> {
    let params = itry!{ req.get_ref::<Params>(), status::BadRequest };
    let usr = iexpect!{ params.get("usr") };
    let psw = iexpect!{ params.get("psw") };

    if let (&Value::String(ref username), &Value::String(ref password)) = (usr, psw) {
        // TODO: GraphQL internally? And only GraphQL does database access?
        let hash = database::get::hashed_password_for(username);
        let usr = database::get::id_for(username);
        if itry! { bcrypt::verify(password, hash.as_str()) } {
            // TODO: get a real secret key
            let authtoken = itry! { encode(&Header::default(), &Claims{ usr }, "FAKE_SECRET_KEY".as_ref()) };
            return cr::ok(authtoken)
        }
    }
    cr::fail("Invalid credentials")
}

pub fn new() -> Router {
    let mut router = Router::new();
    router
        .get("/", reauth, "reauth")
        .post("/", auth, "auth");
    router
}
