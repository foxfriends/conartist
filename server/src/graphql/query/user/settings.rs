//! Holds information about a user's settings
use crate::database::models::*;
use crate::money::Currency;
use juniper::graphql_object;

#[graphql_object]
#[graphql(description = "Holds information about a user's settings")]
impl Settings {
    fn user_id(&self) -> i32 {
        self.user_id
    }
    fn currency(&self) -> Currency {
        self.currency
    }
    fn language(&self) -> &String {
        &self.language
    }
}
