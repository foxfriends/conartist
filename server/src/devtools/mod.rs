//! Serves the dev tools page, used for manually testing the API
use iron::Chain;
use std::path::Path;
use staticfile::Static;

use super::middleware::DefaultTo;

pub fn new() -> Chain {
    chain! [
        #[ DefaultTo::new("../dev/index.html") ]
        Static::new(Path::new("../dev/"))
    ]
}
