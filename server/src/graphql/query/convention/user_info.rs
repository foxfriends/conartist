//! Holds user contributed information about a convention
use juniper::{graphql_object, FieldResult};

use crate::database::models::*;
use crate::database::Database;

graphql_object!(ConventionUserInfo: Database |&self| {
    description: "Extra information about the convention, provided by users and ranked for trustworthiness"

    field id() -> i32 { self.con_info_id }
    field info() -> &String { &self.information }
    field upvotes() -> i32 { self.upvotes }
    field downvotes() -> i32 { self.downvotes }

    field vote(&executor, user_id: Option<i32>) -> FieldResult<i32> {
        dbtry! {
            executor
                .context()
                .get_user_vote_for_convention_user_info(user_id, self.con_info_id)
        }
    }
});
