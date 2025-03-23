//! Holds user contributed information about a convention
use juniper::{FieldResult, graphql_object};

use crate::database::Database;
use crate::database::models::*;

#[graphql_object]
#[graphql(
    description = "Extra information about the convention, provided by users and ranked for trustworthiness"
)]
impl ConventionUserInfo {
    fn id(&self) -> i32 {
        self.con_info_id
    }
    fn info(&self) -> &String {
        &self.information
    }
    fn upvotes(&self) -> i32 {
        self.upvotes
    }
    fn downvotes(&self) -> i32 {
        self.downvotes
    }

    fn vote(&self, context: &Database, user_id: Option<i32>) -> FieldResult<i32> {
        dbtry! {
            context
                .get_user_vote_for_convention_user_info(user_id, self.con_info_id)
        }
    }
}
