pub struct Connection<T> {
    pub nodes: Vec<T>,
    pub offset: i64,
    pub total: i64,
}

pub struct Edge<T, C> {
    pub node: T,
    pub cursor: C,
}

impl<T, C> Edge<T, C> {
    pub fn new(node: T, cursor: C) -> Self {
        Self {
            node,
            cursor,
        }
    }
}

impl<T> Connection<T> {
    pub fn new(nodes: Vec<T>, offset: i64, total: i64) -> Self {
        Self {
            nodes,
            offset,
            total,
        }
    }
}
