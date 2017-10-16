//! Provides the schema of the GraphQL API. Uses the Database as the context.

mod convention;
mod product_type;
mod product;
mod price;
mod user_convention;
mod user;

use chrono::NaiveDate;
use juniper::{FieldResult, FieldError, Value};
use database::Database;

pub struct Query;

graphql_object!(Query: Database |&self| {
    description: "Entry-point of the ConArtist GraphQL API"

    field user(
        &executor,
        id: i32 as "The ID of the user to retrieve",
    ) -> FieldResult<user::User> as "Retrieves one user, corresponding to the provided ID" {
        executor
            .context()
            .get_user_by_id(id)
            .map_err(|s| FieldError::new(s, Value::null()))
    }

    field convention(
        &executor,
        date: NaiveDate as "The earliest day for which to retrieve conventions",
        limit = 5: i32 as "The limit on how many conventions to retrieve",
        page = 0: i32 as "Which page to retrieve from",
    ) -> Vec<convention::Convention> as "Retrieves one page of conventions which start after a given date" {
        executor
            .context()
            .get_conventions_after(date)
            .map(|cons| cons
                .into_iter()
                .skip((page * limit) as usize)
                .take(limit as usize)
                .collect())
            .unwrap_or(vec![])
    }
});
