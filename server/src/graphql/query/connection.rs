pub struct Connection<T, C = i64> {
    pub nodes: Vec<T>,
    pub offset: C,
    pub total: i64,
}

pub struct Edge<T, C> {
    pub node: T,
    pub cursor: C,
}

impl<T, C> Edge<T, C> {
    pub fn new(node: T, cursor: C) -> Self {
        Self { node, cursor }
    }
}

impl<T, C> Connection<T, C> {
    pub fn new(nodes: Vec<T>, offset: C, total: i64) -> Self {
        Self {
            nodes,
            offset,
            total,
        }
    }
}
