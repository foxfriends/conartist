//! Holds information about a product type
use crate::database::models::*;
use juniper::graphql_object;

#[graphql_object]
#[graphql(
    name = "ProductType",
    description = "Holds information about a product type"
)]
impl ProductTypeSnapshot {
    fn id(&self) -> i32 {
        self.type_id
    }
    fn name(&self) -> &String {
        &self.name
    }
    fn color(&self) -> Option<i32> {
        self.color
    }
    fn discontinued(&self) -> bool {
        self.discontinued
    }
    fn sort(&self) -> i32 {
        self.sort
    }
}
