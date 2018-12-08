use juniper::graphql_object;

use super::super::connection::{Connection, Edge};
use crate::database::Database;
use crate::database::models::*;

graphql_object!(Connection<ScoredSuggestion>: Database as "SuggestionsConnection" |&self| {
    description: "A series of suggestions"

    field edges() -> Vec<Edge<ScoredSuggestion, i64>> {
        self.nodes.iter().cloned().enumerate().map(|(i, n)| Edge::new(n, i as i64 + self.offset)).collect()
    }

    field nodes() -> &Vec<ScoredSuggestion> {
        &self.nodes
    }

    field start_cursor() -> Option<String> {
        Some(self.offset.to_string())
    }

    field end_cursor() -> Option<String> {
        Some((self.offset + self.nodes.len() as i64).to_string())
    }

    field total_nodes() -> i32 {
        self.total as i32
    }
});

graphql_object!(Edge<ScoredSuggestion, i64>: Database as "SuggestionsConnectionEdge" |&self| {
    description: "An edge in the suggestions connection"

    field node() -> &ScoredSuggestion {
        &self.node
    }

    field cursor() -> String {
        self.cursor.to_string()
    }
});
