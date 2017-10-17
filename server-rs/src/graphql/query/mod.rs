//! The entry point of a GraphQL query

mod convention;
mod product_type;
mod product;
mod price;
mod record;
mod expense;
mod user_convention;
mod user;

use chrono::NaiveDate;
use juniper::{FieldResult, FieldError, Value};
use database::{Database, User, Convention};

pub struct Query;

graphql_object!(Query: Database |&self| {
    description: "Entry-point of the ConArtist GraphQL API"

    field user(
        &executor,
        id: Option<i32> as "The ID of the user to retrieve. Leave out to request self",
    ) -> FieldResult<User> as "Retrieves one user, corresponding to the provided ID" {
        executor
            .context()
            .get_user_by_id_or_self(id)
            .map_err(|s| FieldError::new(s, Value::null()))
    }

    field convention(
        &executor,
        date: NaiveDate as "The earliest day for which to retrieve conventions",
        limit = 5: i32 as "The limit on how many conventions to retrieve",
        page = 0: i32 as "Which page to retrieve from",
    ) -> Vec<Convention> as "Retrieves one page of conventions which start after a given date" {
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
