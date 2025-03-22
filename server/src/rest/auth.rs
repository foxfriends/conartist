//! Handles authentication and re-authentication of users using JWT authentication.
//! This is the only part of the API that is exposed to unauthenticated users.

use crate::cr;
use crate::database::Database;
use crate::middleware::VerifyJWT;
use bcrypt;
use bodyparser;
use iron::prelude::*;
use iron::{Handler, iexpect, itry, status};
use log::info;
use router::Router;
use serde::Deserialize;

use super::authtoken::{self, Claims};
#[cfg(feature = "mailer")]
use crate::email::reset_password;

fn reauth(req: &mut Request<'_, '_>) -> IronResult<Response> {
    let claims = iexpect! { req.extensions.get::<Claims>() };
    let authtoken = itry! { authtoken::updating_claims(&claims) };
    return cr::ok(authtoken);
}

#[derive(Clone, Deserialize)]
struct LoginRequest {
    pub usr: String,
    pub psw: String,
}

struct Auth {
    database: Database,
}
impl Handler for Auth {
    fn handle(&self, req: &mut Request<'_, '_>) -> IronResult<Response> {
        let params =
            itry! { req.get_ref::<bodyparser::Struct<LoginRequest>>(), status::BadRequest }.clone();
        let LoginRequest { usr, psw } = iexpect! { params };

        match self.database.get_user_for_email(&usr.to_lowercase()) {
            Ok(usr) => {
                if itry! { bcrypt::verify(psw, usr.password.as_str()) } {
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
    }
}

#[derive(Clone, Deserialize)]
struct ChangePasswordData {
    pub old: String,
    pub new: String,
}

struct ChangePassword {
    database: Database,
}
impl Handler for ChangePassword {
    fn handle(&self, req: &mut Request<'_, '_>) -> IronResult<Response> {
        let rbody =
            itry! { req.get::<bodyparser::Struct<ChangePasswordData>>(), status::BadRequest }
                .clone();
        let claims = iexpect! { req.extensions.get::<Claims>() };
        let ChangePasswordData { old, new } = iexpect! { rbody };
        if old.is_empty() || new.is_empty() {
            return cr::fail("Invalid request");
        }
        match self.database.set_user_password(Some(claims.usr), old, new) {
            Ok(_) => cr::ok(true),
            Err(ref s) => cr::fail(s),
        }
    }
}

#[derive(Clone, Deserialize)]
struct ResetPasswordData {
    pub email: String,
}

struct ResetPassword {
    database: Database,
}
impl Handler for ResetPassword {
    fn handle(&self, req: &mut Request<'_, '_>) -> IronResult<Response> {
        let rbody =
            itry! { req.get::<bodyparser::Struct<ResetPasswordData>>(), status::BadRequest }
                .clone();
        let ResetPasswordData { email } = iexpect! { rbody };
        if email.is_empty() {
            return cr::fail("Invalid request");
        }
        match self.database.reset_password(&email.to_lowercase()) {
            Ok(password_reset) => {
                #[cfg(feature = "mailer")]
                {
                    if let Err(error) =
                        reset_password::send(email, password_reset.verification_code)
                    {
                        cr::fail(&format!("{}", error))
                    } else {
                        cr::ok(true)
                    }
                }
                #[cfg(not(feature = "mailer"))]
                {
                    cr::ok(true)
                }
            }
            Err(ref s) => cr::fail(s),
        }
    }
}

pub fn new(db: Database) -> Router {
    let mut router = Router::new();

    router
        .get("/", chain![ VerifyJWT::new(); reauth ], "reauth")
        .post(
            "/",
            Auth {
                database: db.clone(),
            },
            "auth",
        )
        .post(
            "/reset-password",
            ResetPassword {
                database: db.clone(),
            },
            "auth_reset_password",
        )
        .post(
            "/change-password",
            chain![ VerifyJWT::new(); ChangePassword { database: db } ],
            "auth_change_password",
        );

    router
}
