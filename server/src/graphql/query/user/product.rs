//! Holds information about a product
use crate::database::models::*;
use juniper::graphql_object;

#[graphql_object]
#[graphql(description = "Holds information about a product", name = "Product")]
impl ProductSnapshot {
    fn id(&self) -> i32 {
        self.product_id
    }

    fn type_id(&self) -> i32 {
        self.type_id
    }

    fn name(&self) -> &String {
        &self.name
    }

    fn discontinued(&self) -> bool {
        self.discontinued
    }

    fn quantity(&self) -> i32 {
        self.quantity as i32
    }

    fn sort(&self) -> i32 {
        self.sort
    }

    fn sku(&self) -> &Option<String> {
        &self.sku
    }
}
