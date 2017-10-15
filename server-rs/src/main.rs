extern crate serde;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json as json;
extern crate postgres;
extern crate r2d2;
extern crate r2d2_postgres;
#[macro_use] extern crate juniper;
extern crate juniper_iron;
#[macro_use] extern crate iron;
extern crate mount;
extern crate router;
extern crate params;
extern crate staticfile;
extern crate jsonwebtoken as jwt;
extern crate bcrypt;
extern crate chrono;

#[macro_use] mod macros;
mod web;
mod rest;
mod middleware;
mod graphql;
mod database;
mod cr;
mod error;

use std::env;
use mount::Mount;
use iron::prelude::*;
use juniper_iron::GraphQLHandler;
use r2d2_postgres::{TlsMode, PostgresConnectionManager};

fn main() {
    let conn_str =
        if let Ok(cstr) = env::var("DATABASE_URL") {
            cstr
        } else {
            String::from("postgresql://conartist_app:temporary-password@localhost/conartist")
        };
    let config = r2d2::Config::default();
    let manager = PostgresConnectionManager::new(conn_str, TlsMode::None).unwrap();
    let pool = r2d2::Pool::new(config, manager).unwrap();
    let database = database::DatabaseFactory::new(pool.clone());
    let privileged = database.create_privileged();
    let mut mount = Mount::new();

    let graphql =
        if env::args().all(|a| a != "open") {
            chain! [
                middleware::VerifyJWT::new();
                GraphQLHandler::new(
                    move |r| database.create(r),
                    graphql::Query,
                    juniper::EmptyMutation::new(),
                )
            ]
        } else {
            chain! [
                GraphQLHandler::new(
                    move |_| database.create_privileged(),
                    graphql::Query,
                    juniper::EmptyMutation::new(),
                )
            ]
        };

    mount
        .mount("/api/v2", graphql)
        .mount("/api", rest::new(privileged))
        .mount("/", web::new());

    println!("Starting ConArtist server at localhost:8080");

    Iron::new(mount).http("localhost:8080").unwrap();
}
