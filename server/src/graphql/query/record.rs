//! Holds information about a sale record
use database::{Database, Money};
use chrono::NaiveDateTime;
use database::Record;

graphql_object!(Record: Database |&self| {
    description: "Holds information about a sale record"

    field id() -> i32 { self.record_id }
    field products() -> &Vec<i32> { &self.products }
    field price() -> Money { self.price }
    field time() -> NaiveDateTime { self.sale_time }
});
