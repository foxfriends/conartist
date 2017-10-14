//! Provides the schema of the GraphQL API. Uses the Database as the context.

use database::Database;

pub struct Query;
graphql_object!(Query: Database |&self| {
    field user() -> bool { false }
});
