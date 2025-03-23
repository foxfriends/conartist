use super::super::connection::{Connection, Edge};
use crate::database::Database;
use crate::database::models::*;
use juniper::graphql_object;

#[graphql_object]
#[graphql(
    description = "A series of conventions",
    name = "ConventionsConnection",
    context = Database,
)]
impl Connection<Convention> {
    fn edges(&self) -> Vec<Edge<Convention, i64>> {
        self.nodes
            .iter()
            .cloned()
            .enumerate()
            .map(|(i, n)| Edge::new(n, i as i64 + self.offset))
            .collect()
    }

    fn nodes(&self) -> &Vec<Convention> {
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
    name = "ConventionsConnectionEdge",
    description = "An edge in the conventions connection",
    context = Database,
)]
impl Edge<Convention, i64> {
    fn node(&self) -> &Convention {
        &self.node
    }

    fn cursor(&self) -> String {
        self.cursor.to_string()
    }
}
