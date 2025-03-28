//! Holds information about a sale record
use juniper::graphql_object;
use uuid::Uuid;

use crate::database::models::*;
use crate::graphql::DateTimeFixedOffset;
use crate::money::Money;

#[graphql_object]
#[graphql(description = "Holds information about a sale record")]
impl Record {
    fn id(&self) -> i32 {
        self.record_id
    }
    fn products(&self) -> &Vec<i32> {
        &self.products
    }
    fn price(&self) -> Money {
        self.price
    }
    fn info(&self) -> &String {
        &self.info
    }
    fn time(&self) -> DateTimeFixedOffset {
        DateTimeFixedOffset(self.sale_time.0)
    }
    fn uuid(&self) -> Option<Uuid> {
        self.gen_id
    }
}
