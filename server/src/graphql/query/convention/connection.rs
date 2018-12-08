use juniper::graphql_object;
use super::super::connection::{Connection, Edge};
use crate::database::Database;
use crate::database::models::*;

graphql_object!(Connection<Convention>: Database as "ConventionsConnection" |&self| {
    description: "A series of conventions"

    field edges() -> Vec<Edge<Convention, i64>> {
        self.nodes.iter().cloned().enumerate().map(|(i, n)| Edge::new(n, i as i64 + self.offset)).collect()
    }

    field nodes() -> &Vec<Convention> {
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

graphql_object!(Edge<Convention, i64>: Database as "ConventionsConnectionEdge" |&self| {
    description: "An edge in the conventions connection"

    field node() -> &Convention {
        &self.node
    }

    field cursor() -> String {
        self.cursor.to_string()
    }
});
