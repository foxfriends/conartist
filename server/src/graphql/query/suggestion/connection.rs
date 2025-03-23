use juniper::graphql_object;

use super::super::connection::{Connection, Edge};
use crate::database::Database;
use crate::database::models::*;

#[graphql_object]
#[graphql(
    name = "SuggestionsConnection",
    description = "A series of suggestions"
    context = Database
)]
impl Connection<ScoredSuggestion> {
    fn edges(&self) -> Vec<Edge<ScoredSuggestion, i64>> {
        self.nodes
            .iter()
            .cloned()
            .enumerate()
            .map(|(i, n)| Edge::new(n, i as i64 + self.offset))
            .collect()
    }

    fn nodes(&self) -> &Vec<ScoredSuggestion> {
        &self.nodes
    }

    fn start_cursor(&self) -> Option<String> {
        Some(self.offset.to_string())
    }

    fn end_cursor(&self) -> Option<String> {
        Some((self.offset + self.nodes.len() as i64).to_string())
    }

    fn total_nodes(&self) -> i32 {
        self.total as i32
    }
}

#[graphql_object]
#[graphql(
    name = "SuggestionsConnectionEdge",
    description = "An edge in the suggestions connection",
    context = Database
)]
impl Edge<ScoredSuggestion, i64> {
    fn node(&self) -> &ScoredSuggestion {
        &self.node
    }

    fn cursor(&self) -> String {
        self.cursor.to_string()
    }
}
