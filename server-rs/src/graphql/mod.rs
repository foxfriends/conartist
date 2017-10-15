//! Provides the schema of the GraphQL API. Uses the Database as the context.

mod user;

use database::Database;

pub struct Query;

graphql_object!(Query: Database |&self| {
    description: "Entry-point of the GraphQL API"

    field user(&executor, id: i32) -> Option<user::User> {
        executor
            .context()
            .get_user_by_id(id)
    }
});
