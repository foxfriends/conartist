extern crate serde;
#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json;
#[macro_use] extern crate diesel;
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
extern crate hyper;
extern crate base64;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate uuid;

#[macro_use] mod macros;
mod web;
mod rest;
mod middleware;
mod graphql;
mod resource;
mod database;
mod cr;
mod error;
mod money;
mod devtools;

use std::env;
use mount::Mount;
use iron::prelude::*;
use iron_cors::CorsMiddleware;
use juniper::EmptyMutation;
use juniper_iron::GraphQLHandler;
use colored::*;
use hyper::client::Client;
use diesel::pg::PgConnection;
use r2d2_diesel::ConnectionManager;

const DATABASE_URL: &'static str = "postgresql://conartist_app:temporary-password@localhost/conartist";
const DEFAULT_PORT: &'static str = "8080";

fn main() {
    println!();
    println!("Starting ConArtist server...");

    let conn_str = env::var("DATABASE_URL").unwrap_or(DATABASE_URL.to_string());
    let manager = ConnectionManager::<PgConnection>::new(conn_str);
    let pool = r2d2::Pool::builder().build(manager).expect("Failed to create pool");
    let database = database::DatabaseFactory::new(pool);
    let privileged = database.create_privileged();
    let mut mount = Mount::new();
    let cors =
        if env::args().any(|a| a == "--any-origin") {
            println!();
            println!("{}", "WARNING: Running with no CORS protection. All origins are permitted.".yellow());
            println!("{}", "         Do not run with `--any-origin` flag in production!".yellow());
            println!();
            CorsMiddleware::with_allow_any()
        } else {
            CorsMiddleware::with_whitelist(["https://con--artist.herokuapp.com".to_string()].into_iter().cloned().collect())
        };

    let graphql =
        if env::args().any(|a| a == "--open") {
            println!();
            println!("{}", "WARNING: Running in open mode. No authorization required.".yellow());
            println!("{}", "         Do not run with `--open` flag in production!".yellow());
            println!();
            chain! [
                GraphQLHandler::new(
                    move |_| database.create_privileged(),
                    graphql::Query,
                    graphql::Mutation,
                )
            ]
        } else {
            chain! [
                middleware::VerifyJWT::new();
                GraphQLHandler::new(
                    move |r| database.create(r),
                    graphql::Query,
                    graphql::Mutation,
                )
            ]
        };

    let resource =
        GraphQLHandler::new(
            |_| Client::new(), // TODO: HTTPS support
            resource::Query,
            EmptyMutation::new(),
        );

    if env::args().any(|a| a == "--dev") {
        println!();
        println!("{}", "WARNING: Running in dev mode. Dev tools page is exposed.".yellow());
        println!("{}", "         Do not run with `--dev` flag in production!".yellow());
        println!();
        mount.mount("/dev", devtools::new());
    }

    mount
        .mount("/api/v2", graphql)
        .mount("/resource", resource)
        .mount("/api", rest::new(privileged))
        .mount("/", web::new());

    let mut chain = Chain::new(mount);
    chain.link_around(cors);

    let port = env::var("PORT").unwrap_or(DEFAULT_PORT.to_string());
    let host = "0.0.0.0";
    println!("ConArtist server listening at {}:{}", host, port);
    Iron::new(chain).http(format!("{}:{}", host, port)).unwrap();
}
