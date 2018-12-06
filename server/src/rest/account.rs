//! Handles account creation and queries about existing accounts that require unauthenticated
//! access

use iron::prelude::*;
use iron::{status, Handler};
use router::Router;
use bcrypt;
use bodyparser;
use crate::database::Database;
use crate::cr;
use super::authtoken;

#[cfg(feature="mailer")]
use crate::email::confirm_new_account;

#[derive(Clone, Deserialize)]
struct CreateAccountData {
    email: String,
    name: String,
    password: String,
}

struct Create { database: Database }
impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let rbody = itry!{ req.get::<bodyparser::Struct<CreateAccountData>>(), status::BadRequest };
        let body = iexpect!{ rbody };
        if body.email == "" || body.name == "" || body.password == "" {
            // TODO: this could return status::BadRequest somehow
            return cr::fail("Invalid request");
        }
        let hashed = itry!{ bcrypt::hash(&body.password, bcrypt::DEFAULT_COST) };

        self.database.create_user(body.email.to_lowercase(), body.name, hashed)
            .and_then(|(user, email_verification)| {
                #[cfg(feature="mailer")]
                confirm_new_account::send(email_verification.email, email_verification.verification_code)
                    .map_err(|error| format!("{}", error))?;
                #[cfg(not(feature="mailer"))]
                self.database.verify_email(&email_verification.verification_code)?;
                authtoken::new(user.user_id).map_err(|reason| format!("Failed to generate JWT: {}", reason))
            })
            .map(|authtoken| cr::ok(authtoken))
            .unwrap_or_else(|s| cr::fail(&s))
    }
}

struct Exists { database: Database }
impl Handler for Exists {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = iexpect!{ req.extensions.get::<Router>() };
        let email = iexpect!{ params.find("email") };
        cr::ok(self.database.get_user_for_email(&email.to_lowercase()).is_ok())
    }
}

#[derive(Clone, Deserialize)]
struct VerifyData {
    code: String,
}

struct Verify { database: Database }
impl Handler for Verify {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let rbody = itry!{ req.get::<bodyparser::Struct<VerifyData>>(), status::BadRequest };
        let VerifyData { code } = iexpect!{ rbody };
        info!("Verifying: {}", code);
        match self.database.verify_email(&code) {
            Ok(..) => cr::ok(true),
            Err(ref error) => cr::fail(error),
        }
    }
}

#[derive(Clone, Deserialize)]
struct ResetData {
    code: String,
    password: String,
}

struct Reset { database: Database }
impl Handler for Reset {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let rbody = itry!{ req.get::<bodyparser::Struct<ResetData>>(), status::BadRequest };
        let ResetData { code, password } = iexpect!{ rbody };
        info!("Resetting: {}", code);
        match self.database.force_set_password(&code, &password) {
            Ok(..) => cr::ok(true),
            Err(ref error) => cr::fail(error),
        }
    }
}

pub fn new(db: Database) -> Router {
    let mut router = Router::new();

    router
        .post("/new", Create{ database: db.clone() }, "account_new")
        .get("/exists/:email", Exists{ database: db.clone() }, "account_exists")
        .post("/verify", Verify{ database: db.clone() }, "account_verify")
        .post("/reset", Reset { database: db }, "account_reset");

    router
}
