// #[macro_use] extern crate juniper;
// extern crate juniper_iron;
// extern crate postgres;
extern crate iron;
extern crate mount;
extern crate staticfile;

mod web;
mod rest;
mod middleware;
// mod graphql;

// use juniper_iron::GraphQLHandler;
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
