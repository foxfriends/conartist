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
    password: String,
}

struct Create { database: Database }
impl Handler for Create {
    fn handle(&self, req: &mut Request) -> IronResult<Response> {
        let body = iexpect!{ itry!{ req.get::<bodyparser::Struct<CreateAccountData>>(), status::BadRequest }, status::BadRequest };
        let hashed = itry!{ bcrypt::hash(&body.password, bcrypt::DEFAULT_COST) };
        self.database.create_user(body.email, hashed)
            .map(|_| cr::ok(()))
            .unwrap_or_else(|s| cr::fail(&format!("Could not create account: {}", s)))
    }
}

pub fn new(db: Database) -> Router {
    let mut router = Router::new();

    router
        .post("/", Create{ database: db.clone() }, "auth");
        // .get("/", Exists{ database: db }, "auth");

    router
}
