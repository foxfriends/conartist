pub trait Connectable {
    fn cursor(&self) -> String;
}

pub struct Connection<T: Connectable> {
    pub nodes: Vec<T>,
    pub total: i64,
}

pub struct Edge<T: Connectable> {
    pub node: T,
}

impl<T: Connectable> Edge<T> {
    pub fn new(node: T) -> Self {
        Self {
            node,
        }
    }
}

impl<T: Connectable> Connection<T> {
    pub fn new(nodes: Vec<T>, total: i64) -> Self {
        Self {
            nodes,
            total,
        }
    }
}
