use super::super::connection::{Connection, Edge};
use crate::database::models::*;

#[graphql_object]
#[graphql(
    name = "RecordsConnection",
    description = "A series of records, not affiliated with a convention"
)]
impl Connection<Record, Option<i32>> {
    fn edges(&self) -> Vec<Edge<Record, i32>> {
        self.nodes
            .iter()
            .cloned()
            .map(|n| {
                let cursor = n.record_id;
                Edge::new(n, cursor)
            })
            .collect()
    }

    fn nodes(&self) -> &Vec<Record> {
        &self.nodes
    }

    fn start_cursor(&self) -> Option<String> {
        Some(self.nodes.first()?.record_id.to_string())
    }

    fn end_cursor(&self) -> Option<String> {
        Some(self.nodes.last()?.record_id.to_string())
    }

    fn total_nodes(&self) -> i32 {
        self.total as i32
    }
}

#[graphql_object]
#[graphql(
    name = "RecordsConnectionEdge",
    description = "An edge in the records connection"
)]
impl Edge<Record, i32> {
    fn node(&self) -> &Record {
        &self.node
    }

    fn cursor(&self) -> String {
        self.cursor.to_string()
    }
}
