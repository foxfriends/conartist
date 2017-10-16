//! Provides the schema of the GraphQL API. Uses the Database as the context.

mod product_type;
mod product;
mod price;
mod user_convention;
mod user;

use juniper::{FieldResult, FieldError, Value};
use database::Database;

pub struct Query;

graphql_object!(Query: Database |&self| {
    description: "Entry-point of the ConArtist GraphQL API"

    field user(
        &executor,
        id: i32 as "The ID of the user to retrieve",
    ) -> FieldResult<user::User> {
        executor
            .context()
            .get_user_by_id(id)
            .map_err(|s| FieldError::new(s, Value::null()))
    }
});
