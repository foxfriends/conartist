extern crate serde;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json;
#[macro_use] extern crate postgres;
extern crate postgres_array;
extern crate r2d2;
extern crate r2d2_postgres;
#[macro_use] extern crate juniper;
#[macro_use] extern crate juniper_codegen;
extern crate juniper_iron;
#[macro_use] extern crate iron;
extern crate mount;
extern crate router;
extern crate params;
extern crate staticfile;
extern crate bodyparser;
extern crate jsonwebtoken as jwt;
extern crate bcrypt;
extern crate chrono;
extern crate colored;
extern crate iron_cors;

#[macro_use] mod macros;
mod web;
mod rest;
mod middleware;
mod graphql;
mod database;
mod cr;
mod error;
mod money;

use std::env;
use mount::Mount;
use iron::prelude::*;
use iron_cors::CorsMiddleware;
use juniper_iron::GraphQLHandler;
use r2d2_postgres::{TlsMode, PostgresConnectionManager};
use colored::*;

const DATABASE_URL: &'static str = "postgresql://conartist_app:temporary-password@localhost/conartist";
const DEFAULT_PORT: &'static str = "8080";

fn main() {
    println!();
    println!("Starting ConArtist server...");

    let conn_str = env::var("DATABASE_URL").unwrap_or(DATABASE_URL.to_string());
    let manager = PostgresConnectionManager::new(conn_str, TlsMode::None).unwrap();
    let pool = r2d2::Pool::new(manager).unwrap();
    let database = database::DatabaseFactory::new(pool.clone());
    let privileged = database.create_privileged();
    let mut mount = Mount::new();
    let cors = CorsMiddleware::with_whitelist(["https://con--artist.herokuapp.com".to_string()].into_iter().cloned().collect());

    let graphql =
        if env::args().all(|a| a != "--open") {
            chain! [
                middleware::VerifyJWT::new();
                GraphQLHandler::new(
                    move |r| database.create(r),
                    graphql::Query,
                    graphql::Mutation,
                )
            ]
        } else {
            println!();
            println!("{}", "WARNING: Running in test mode. No authorization required.".yellow());
            println!("{}", "         Do not run with `--open` flag in production!".yellow());
            println!();
            chain! [
                GraphQLHandler::new(
                    move |_| database.create_privileged(),
                    graphql::Query,
                    graphql::Mutation,
                )
            ]
        };

    mount
        .mount("/api/v2", graphql)
        .mount("/api", rest::new(privileged))
        .mount("/", web::new());

    let mut chain = Chain::new(mount);
    chain.link_around(cors);

    let port = env::var("PORT").unwrap_or(DEFAULT_PORT.to_string());
    let host = "0.0.0.0";
    println!("ConArtist server listening at {}:{}", host, port);
    Iron::new(chain).http(format!("{}:{}", host, port)).unwrap();
}
