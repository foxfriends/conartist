//! Holds information about a convention
use database::Database;
use chrono::NaiveDate;
pub use database::Convention;

graphql_object!(Convention: Database |&self| {
    description: "Holds information about a user convention"

    field id() -> i32 { self.con_id }
    field code() -> &String { &self.code }
    field name() -> &String { &self.title }
    field start() -> NaiveDate { self.start_date }
    field end() -> NaiveDate { self.end_date }
});
