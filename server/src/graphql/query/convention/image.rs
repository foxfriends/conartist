//! Information about a convention's images
use database::models::*;
use database::Database;

graphql_object!(ConventionImage: Database |&self| {
    field id() -> &String { &self.image_uuid }
});
