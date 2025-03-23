//! Holds extra information about a convention
use juniper::graphql_object;

use crate::database::models::*;

#[graphql_object]
#[graphql(description = "Extra information about the convention, provided by the service")]
impl ConventionExtraInfo {
    fn title(&self) -> &String {
        &self.title
    }
    fn info(&self) -> Option<String> {
        Some(self.info.clone()?.to_string())
    }
    fn action(&self) -> &Option<String> {
        &self.action
    }
    fn action_text(&self) -> &Option<String> {
        &self.action_text
    }
}
