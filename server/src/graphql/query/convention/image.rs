//! Information about a convention's images
use juniper::graphql_object;

use crate::database::models::*;

#[graphql_object]
impl ConventionImage {
    fn id(&self) -> &String {
        &self.image_uuid
    }
}
