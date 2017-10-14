//! Serves the user facing web client, providing the static JS/CSS files, and the index.html file
//! for all other URLs to support the single page application.

use iron::Chain;
use std::path::Path;
use staticfile::Static;

use super::middleware::DefaultTo;

pub fn new() -> Chain {
    let mut chain = Chain::new(Static::new(Path::new("../web/")));
    chain.link_around(DefaultTo::new("../web/index.html"));
    chain
}
