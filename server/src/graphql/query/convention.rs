//! Holds information about a convention
use chrono::{DateTime, Utc};
use database::Database;
pub use database::Convention;

graphql_object!(Convention: Database |&self| {
    description: "Holds information about a convention"

    field id() -> i32 { self.con_id }
    field code() -> &String { &self.code }
    field name() -> &String { &self.title }
    field start() -> DateTime<Utc> { DateTime::from_utc(self.start_date.and_hms(0, 0, 0), Utc) }
    field end() -> DateTime<Utc> { DateTime::from_utc(self.end_date.and_hms(23, 59, 59), Utc) }
});
