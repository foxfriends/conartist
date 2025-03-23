#![deny(bare_trait_objects)]

// waiting for these crates to update their macros
#[macro_use]
extern crate juniper;
#[macro_use]
extern crate diesel;

#[macro_use]
mod macros;
mod cr;
mod database;
mod devtools;
#[cfg(feature = "mailer")]
mod email;
mod env;
mod error;
mod graphql;
mod juniper_iron;
mod middleware;
mod money;
mod rand;
mod resource;
mod rest;
mod search;
mod web;

use colored::*;
use diesel::pg::PgConnection;
use hyper::client::Client;
use iron::prelude::*;
use iron_cors::CorsMiddleware;
use juniper::{DefaultScalarValue, EmptyMutation, EmptySubscription};
use juniper_iron::GraphQLHandler;
use logger::Logger;
use mount::Mount;
use std::env::args;

use crate::env::CONARTIST_BASE_URL;

fn main() {
    env_logger::init();
    dotenv::dotenv().ok();

    println!();
    println!("Starting ConArtist server...");

    let manager =
        diesel::r2d2::ConnectionManager::<PgConnection>::new(env::DATABASE_URL.to_string());
    let pool = diesel::r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool");
    let database = database::DatabaseFactory::new(pool);
    let privileged = database.create_privileged();
    let mut mount = Mount::new();
    let cors = if args().any(|a| a == "--any-origin") {
        println!();
        println!(
            "{}",
            "WARNING: Running with no CORS protection. All origins are permitted.".yellow()
        );
        println!(
            "{}",
            "         Do not run with `--any-origin` flag in production!".yellow()
        );
        println!();
        CorsMiddleware::with_allow_any()
    } else {
        CorsMiddleware::with_whitelist(
            [format!("https://{}", CONARTIST_BASE_URL.to_string())]
                .iter()
                .cloned()
                .collect(),
        )
    };

    let graphql = if args().any(|a| a == "--open") {
        println!();
        println!(
            "{}",
            "WARNING: Running in open mode. No authorization required.".yellow()
        );
        println!(
            "{}",
            "         Do not run with `--open` flag in production!".yellow()
        );
        println!();
        let mut mount = Mount::new();
        mount.mount(
            "/",
            GraphQLHandler::<_, _, _, _, _, DefaultScalarValue>::new(
                move |_| Ok(database.create_privileged()),
                graphql::Query,
                graphql::Mutation,
                EmptySubscription::<database::Database>::new(),
            ),
        );
        chain![mount]
    } else {
        let mut mount = Mount::new();
        mount.mount(
            "/",
            GraphQLHandler::<_, _, _, _, _, DefaultScalarValue>::new(
                move |r| Ok(database.create(r)),
                graphql::Query,
                graphql::Mutation,
                EmptySubscription::<database::Database>::new(),
            ),
        );
        chain![middleware::VerifyJWT; mount]
    };

    let resource = GraphQLHandler::<_, _, _, _, _, DefaultScalarValue>::new(
        |_| Ok(resource::ResourceContext(Client::new())),
        resource::Query,
        EmptyMutation::<resource::ResourceContext>::new(),
        EmptySubscription::<resource::ResourceContext>::new(),
    );

    if args().any(|a| a == "--dev") {
        println!();
        println!(
            "{}",
            "WARNING: Running in dev mode. Dev tools page is exposed.".yellow()
        );
        println!(
            "{}",
            "         Do not run with `--dev` flag in production!".yellow()
        );
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

    let (pre, post) = Logger::new(None);
    chain.link_before(pre).link_after(post);

    let host = "0.0.0.0";
    println!(
        "ConArtist server listening at {}:{}",
        host,
        env::PORT.to_string()
    );
    Iron::new(chain)
        .http(format!("{}:{}", host, env::PORT.to_string()))
        .unwrap();
}
