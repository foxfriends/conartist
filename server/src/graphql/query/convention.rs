//! Holds information about a convention
use chrono::{DateTime, Utc};
use database::Database;
use juniper::FieldResult;
pub use database::{Convention, ConventionExtraInfo, ConventionUserInfo};

graphql_object!(Convention: Database |&self| {
    description: "Holds information about a convention"

    field id() -> i32 { self.con_id }
    field name() -> &String { &self.title }
    field start() -> DateTime<Utc> { DateTime::from_utc(self.start_date.and_hms(0, 0, 0), Utc) }
    field end() -> DateTime<Utc> { DateTime::from_utc(self.end_date.and_hms(23, 59, 59), Utc) }
    
    field extra_info() -> &Vec<ConventionExtraInfo> { &self.extra_info }
    field user_info(&executor) -> FieldResult<Vec<ConventionUserInfo>> {
        dbtry! {
            executor
                .context()
                .get_convention_user_info_for_convention(self.con_id)
        }
    }
});

graphql_object!(ConventionExtraInfo: Database |&self| {
    description: "Extra information about the convention, provided by the service"

    field title() -> &String { &self.title }
    field info() -> &Option<String> { &self.info }
    field action() -> &Option<String> { &self.action }
    field action_text() -> &Option<String> { &self.action_text }
});

graphql_object!(ConventionUserInfo: Database |&self| {
    description: "Extra information about the convention, provided by users and ranked for trustworthiness"

    field id() -> i32 { self.con_info_id }
    field info() -> &String { &self.info }
    field upvotes() -> i32 { self.upvotes }
    field downvotes() -> i32 { self.downvotes }
});
