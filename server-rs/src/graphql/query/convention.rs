//! Holds information about a convention
use database::Database;
pub use database::Convention;

graphql_object!(Convention: Database |&self| {
    description: "Holds information about a convention"

    field id() -> i32 { self.con_id }
    field code() -> &String { &self.code }
    field name() -> &String { &self.title }
    // TODO: Having trouble returning a NaiveDate here
    field start() -> String { self.start_date.to_string() }
    field end() -> String { self.end_date.to_string() }
});
