#[macro_export]
macro_rules! query {
    ($conn:expr, $query:expr) => {
        $conn.query($query, &[]).unwrap()
    };
    ($conn:expr, $query:expr, $($var:expr),* ) => {
        $conn.query($query, &[$(&$var, )*]).unwrap()
    };
}

macro_rules! chain {
    ($($before:expr),+ ; [ $($around:expr),+ ] $handler:expr ; $($after:expr),+) => {{
        let mut chain = Chain::new($handler);
        $(chain.link_before($before);)+
        $(chain.link_around($before);)+
        $(chain.link_after($after);)+
        chain
    }};
    ($($before:expr),+ ; $handler:expr ; $($after:expr),+) => {{
        let mut chain = Chain::new($handler);
        $(chain.link_before($before);)+
        $(chain.link_after($after);)+
        chain
    }};
    ($($before:expr),+ ; $handler:expr) => {{
        let mut chain = Chain::new($handler);
        $(chain.link_before($before);)+
        chain
    }};
    ([ $($around:expr),+ ] $handler:expr) => {{
        let mut chain = Chain::new($handler);
        $(chain.link_around($around);)+
        chain
    }};
    ($handler:expr) => {
        Chain::new($handler)
    };
}
