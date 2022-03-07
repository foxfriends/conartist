//! Provides the schema of the GraphQL API. Uses the Database as the context.

mod mutation;
mod query;

pub use self::mutation::Mutation;
pub use self::query::Query;
