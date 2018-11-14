//! Handles authentication and re-authentication of users using JWT authentication.
//! This is the only part of the API that is exposed to unauthenticated users.

use iron::prelude::*;
use iron::{status, Handler};
use router::Router;
use params::{Params, Value};
use bcrypt;
use database::Database;
use middleware::VerifyJWT;
use cr;
use bodyparser;
use super::authtoken::{self, Claims};

fn reauth(req: &mut Request) -> IronResult<Response> {
    let claims = iexpect!{ req.extensions.get::<Claims>() };
    let authtoken = itry! { authtoken::with_claims(&claims) };
    return cr::ok(authtoken);
}

struct Auth { database: Database }
impl Handler for Auth {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = itry!{ req.get_ref::<Params>(), status::BadRequest };
        let usr = iexpect!{ params.get("usr") };
        let psw = iexpect!{ params.get("psw") };

        if let (&Value::String(ref email), &Value::String(ref password)) = (usr, psw) {
            match self.database.get_user_for_email(&email.to_lowercase()) {
                Ok(usr) => {
                    if itry! { bcrypt::verify(password, usr.password.as_str()) } {
                        let authtoken = itry! { authtoken::new(usr.user_id) };
                        cr::ok(authtoken)
                    } else {
                        cr::fail("Invalid credentials")
                    }
                }
                Err(error) => {
                    info!("{}", error);
                    cr::fail("Unknown user")
                }
            }
        } else {
            cr::fail("Invalid request")
        }
    }
}

#[derive(Clone, Deserialize)]
struct ChangePasswordData {
    pub old: String,
    pub new: String,
}

struct ChangePassword { database: Database }
impl Handler for ChangePassword {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let rbody = itry!{ req.get::<bodyparser::Struct<ChangePasswordData>>(), status::BadRequest }.clone();
        let claims = iexpect!{ req.extensions.get::<Claims>() };
        let body = iexpect!{ rbody };
        if body.old.is_empty() || body.new.is_empty() {
            return cr::fail("Invalid request");
        }
        if let Ok(user) = self.database.get_user_by_id(Some(claims.usr)) {
            if !itry! { bcrypt::verify(&body.old, user.password.as_str()) } {
                return cr::fail("Old password is incorrect");
            }
        }
        let hashed = itry!{ bcrypt::hash(&body.new, bcrypt::DEFAULT_COST) };
        match self.database.change_password(claims.usr, hashed) {
            Ok(_) => cr::ok(true),
            Err(ref s) => cr::fail(s),
        }
    }
}

#[derive(Clone, Deserialize)]
struct ResetPasswordData {
    pub email: String,
}

struct ResetPassword { database: Database }
impl Handler for ResetPassword {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let rbody = itry!{ req.get::<bodyparser::Struct<ResetPasswordData>>(), status::BadRequest }.clone();
        let ResetPasswordData { email } = iexpect!{ rbody };
        if email.is_empty() {
            return cr::fail("Invalid request");
        }
        match self.database.reset_password(&email.to_lowercase()) {
            Ok(password_reset) => {
                // TODO: send_reset_email();
                cr::ok(true)
            },
            Err(ref s) => cr::fail(s),
        }
    }
}

pub fn new(db: Database) -> Router {
    let mut router = Router::new();

    router
        .get("/", chain![ VerifyJWT::new(); reauth ], "reauth")
        .post("/", Auth{ database: db.clone() }, "auth")
        .post("/reset-password", ResetPassword { database: db.clone() }, "auth_reset_password")
        .post("/change-password", chain![ VerifyJWT::new(); ChangePassword { database: db } ], "auth_change_password");

    router
}
