//! Holds information about a user convention
use database::Database;
pub use database::UserConvention;

graphql_object!(UserConvention: Database |&self| {
    description: "Holds information about a user convention"

    field id() -> i32 { self.con_id }
    field user_id() -> i32 { self.user_id }
});
