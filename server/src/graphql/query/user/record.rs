//! Holds information about a sale record
use chrono::{DateTime, FixedOffset};
use uuid::Uuid;

use crate::money::Money;
use crate::database::Database;
use crate::database::models::*;

graphql_object!(Record: Database |&self| {
    description: "Holds information about a sale record"

    field id() -> i32 { self.record_id }
    field products() -> &Vec<i32> { &self.products }
    field price() -> Money { self.price }
    field info() -> &String { &self.info }
    field time() -> DateTime<FixedOffset> { self.sale_time.0 }
    field uuid() -> Option<Uuid> { self.gen_id }
});
