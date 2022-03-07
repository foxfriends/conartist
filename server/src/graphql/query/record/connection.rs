use super::super::connection::{Connection, Edge};
use crate::database::models::*;
use crate::database::Database;
use juniper::graphql_object;

graphql_object!(Connection<Record, Option<i32>>: Database as "RecordsConnection" |&self| {
    description: "A series of records, not affiliated with a convention"

    field edges() -> Vec<Edge<Record, i32>> {
        self.nodes.iter().cloned().map(|n| {
            let cursor = n.record_id;
            Edge::new(n, cursor)
        }).collect()
    }

    field nodes() -> &Vec<Record> {
        &self.nodes
    }

    field start_cursor() -> Option<String> {
        Some(self.nodes.first()?.record_id.to_string())
    }

    field end_cursor() -> Option<String> {
        Some(self.nodes.last()?.record_id.to_string())
    }

    field total_nodes() -> i32 {
        self.total as i32
    }
});

graphql_object!(Edge<Record, i32>: Database as "RecordsConnectionEdge" |&self| {
    description: "An edge in the records connection"

    field node() -> &Record {
        &self.node
    }

    field cursor() -> String {
        self.cursor.to_string()
    }
});
