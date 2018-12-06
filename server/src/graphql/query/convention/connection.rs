use super::super::connection::{Connectable, Connection, Edge};
use crate::database::Database;
use crate::database::models::*;

impl Connectable for Convention {
    fn cursor(&self) -> String {
        return self.con_id.to_string()
    }
}

graphql_object!(Connection<Convention>: Database as "ConventionsConnection" |&self| {
    description: "A series of conventions"

    field edges() -> Vec<Edge<Convention>> {
        self.nodes.iter().cloned().map(Edge::new).collect()
    }

    field nodes() -> &Vec<Convention> {
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

graphql_object!(Edge<Convention>: Database as "ConventionsConnectionEdge" |&self| {
    description: "An edge in the conventions connection"

    field node() -> &Convention {
        &self.node
    }

    field cursor() -> String {
        self.node.cursor()
    }
});
