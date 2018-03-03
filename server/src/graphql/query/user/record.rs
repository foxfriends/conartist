//! Holds information about a sale record
use database::{Database, Record};
use chrono::{DateTime, Utc};
use money::Money;

graphql_object!(Record: Database |&self| {
    description: "Holds information about a sale record"

    field id() -> i32 { self.record_id }
    field products() -> &Vec<i32> { &self.products }
    field price() -> Money { self.price }
    field info() -> &String { &self.info }
    field time() -> DateTime<Utc> { DateTime::from_utc(self.sale_time, Utc) }
});
