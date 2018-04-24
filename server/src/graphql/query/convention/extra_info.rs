//! Holds extra information about a convention
use database::models::*;
use database::Database;

graphql_object!(ConventionExtraInfo: Database |&self| {
    description: "Extra information about the convention, provided by the service"

    field title() -> &String { &self.title }
    field info() -> Option<String> { Some(self.info.clone()?.to_string()) }
    field action() -> &Option<String> { &self.action }
    field action_text() -> &Option<String> { &self.action_text }
});

