//! Provides the schema of the GraphQL API. Uses the Database as the context.

mod convention;
mod product_type;
mod product;
mod price;
mod record;
mod expense;
mod user_convention;
mod user;
mod query;
mod mutation;

pub use self::query::Query;
pub use self::mutation::Mutation;
