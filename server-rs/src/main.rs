#[macro_use] extern crate serde_derive;
#[macro_use] extern crate serde_json as json;
extern crate serde;
#[macro_use] extern crate juniper;
extern crate juniper_iron;
// extern crate postgres;
#[macro_use] extern crate iron;
extern crate mount;
extern crate router;
extern crate params;
extern crate staticfile;
extern crate jsonwebtoken as jwt;
extern crate bcrypt;

mod web;
mod rest;
mod middleware;
mod graphql;
mod database;
mod cr;

use mount::Mount;
use iron::prelude::*;

fn main() {
    let mut mount = Mount::new();

    // let graphql = GraphQLHandler::new(
    //     |_| (),
    //     (),
    //     (),
    // );

    mount
        // .mount("/api/v2", graphql)
        .mount("/api", rest::new())
        .mount("/", web::new());

    println!("Starting ConArtist server at localhost:8080");

    Iron::new(mount).http("localhost:8080").unwrap();
}
