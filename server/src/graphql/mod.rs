//! Provides the schema of the GraphQL API. Uses the Database as the context.

mod query;
mod mutation;

pub use self::query::Query;
pub use self::mutation::Mutation;
