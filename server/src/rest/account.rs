//! Handles account creation and queries about existing accounts that require unauthenticated
//! access

use iron::prelude::*;
use iron::{status, Handler};
use router::Router;
use bcrypt;
use bodyparser;
use database::Database;
use cr;

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
        self.database.create_user(body.email, body.name, hashed)
            .map(|_| cr::ok(()))
            .unwrap_or_else(|s| cr::fail(&s))
    }
}

struct Exists { database: Database }
impl Handler for Exists {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let params = iexpect!{ req.extensions.get::<Router>() };
        let email = iexpect!{ params.find("email") };
        cr::ok(self.database.get_user_for_email(email).map(|_| true).unwrap_or(false))
    }
}

pub fn new(db: Database) -> Router {
    let mut router = Router::new();

    router
        .post("/new", Create{ database: db.clone() }, "account_new")
        .get("/exists/:email", Exists{ database: db }, "account_exists");

    router
}
