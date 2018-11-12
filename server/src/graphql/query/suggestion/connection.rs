use super::super::connection::{Connectable, Connection, Edge};
use database::Database;
use database::models::*;

impl Connectable for ScoredSuggestion {
    fn cursor(&self) -> String {
        return self.suggestion_id.to_string()
    }
}

graphql_object!(Connection<ScoredSuggestion>: Database as "SuggestionsConnection" |&self| {
    description: "A series of suggestions"

    field edges() -> Vec<Edge<ScoredSuggestion>> {
        self.nodes.iter().cloned().map(Edge::new).collect()
    }

    field nodes() -> &Vec<ScoredSuggestion> {
        &self.nodes
    }

    field start_cursor() -> Option<String> {
        self.nodes.first().map(Connectable::cursor)
    }

    field end_cursor() -> Option<String> {
        self.nodes.last().map(Connectable::cursor)
    }

    field total_nodes() -> i32 {
        self.total as i32
    }
});

graphql_object!(Edge<ScoredSuggestion>: Database as "SuggestionsConnectionEdge" |&self| {
    description: "An edge in the suggestions connection"

    field node() -> &ScoredSuggestion {
        &self.node
    }

    field cursor() -> String {
        self.node.cursor()
    }
});
