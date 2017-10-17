//! The entry point of a GraphQL mutation
use database::Database;

pub struct Mutation;

graphql_object!(Mutation: Database |&self| {
    // TODO
});
