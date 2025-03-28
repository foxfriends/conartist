//! Provides the schema of the GraphQL API. Uses the Database as the context.

mod mutation;
mod query;

use chrono::{DateTime, FixedOffset};

/// Legacy rename of date time type in graphql
#[graphql_scalar]
#[graphql(transparent)]
#[derive(Clone, Copy)]
struct DateTimeFixedOffset(DateTime<FixedOffset>);

pub use self::mutation::Mutation;
pub use self::query::Query;
