//! Information about a convention's images
use crate::database::models::*;
use crate::database::Database;

graphql_object!(ConventionImage: Database |&self| {
    field id() -> &String { &self.image_uuid }
});
