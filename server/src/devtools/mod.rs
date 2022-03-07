//! Serves the dev tools pages, used for manually testing the API among other things
use juniper_iron::GraphiQLHandler;
use mount::Mount;
use staticfile::Static;
use std::path::Path;

use super::middleware::DefaultTo;

pub fn new() -> Mount {
    let mut mount = Mount::new();
    mount.mount("/api/graphql", GraphiQLHandler::new("/api/v2"));
    let chain = chain![
        #[DefaultTo::new("../dev/index.html")]
        Static::new(Path::new("../dev/"))
    ];
    mount.mount("/", chain);
    mount
}
