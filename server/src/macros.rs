//! Provides a number of useful macros for assorted purposes
// TODO: should these be placed in meaningful locations? Or is just "around" ok because they are
//       macros

macro_rules! query {
    ($conn:expr, $query:expr) => {
        $conn.query($query, &[]).unwrap()
    };
    ($conn:expr, $query:expr, $($var:expr),* ) => {
        $conn.query($query, &[$(&$var, )*]).unwrap()
    };
}

macro_rules! execute {
    ($conn:expr, $query:expr) => {
        $conn.execute($query, &[])
    };
    ($conn:expr, $query:expr, $($var:expr),* ) => {
        $conn.execute($query, &[$(&$var, )*])
    };
}

macro_rules! chain {
    ($($before:expr),+ ; #[ $($around:expr),* ] $handler:expr ; $($after:expr),+) => {{
        let mut chain = ::iron::Chain::new($handler);
        $(chain.link_before($before);)+
        $(chain.link_around($around);)*
        $(chain.link_after($after);)+
        chain
    }};
    ($($before:expr),+ ; $handler:expr ; $($after:expr),+) => {{
        let mut chain = ::iron::Chain::new($handler);
        $(chain.link_before($before);)+
        $(chain.link_after($after);)+
        chain
    }};

    ($($before:expr),+ ; #[ $($around:expr),* ] $handler:expr) => {{
        let mut chain = ::iron::Chain::new($handler);
        $(chain.link_before($before);)+
        $(chain.link_around($around);)*
        chain
    }};
    ($($before:expr),+ ; $handler:expr) => {{
        let mut chain = ::iron::Chain::new($handler);
        $(chain.link_before($before);)+
        chain
    }};

    (#[ $($around:expr),* ] $handler:expr ; $($after:expr),+) => {{
        let mut chain = ::iron::Chain::new($handler);
        $(chain.link_around($around);)*
        $(chain.link_after($after);)+
        chain
    }};

    (#[ $($around:expr),* ] $handler:expr) => {{
        let mut chain = ::iron::Chain::new($handler);
        $(chain.link_around($around);)*
        chain
    }};
    ($handler:expr) => {
        ::iron::Chain::new($handler)
    };
}

macro_rules! assert_authorized {
    ($db:expr, $id:expr) => {
        if !$db.privileged && $id != $db.user_id.unwrap_or(0) {
            return Err(format!("Not authorized to access user {}", $id))
        }
    };
}

macro_rules! ensure {
    ($pred:expr, $reason:expr) => {
        if !($pred) {
            return Err(::juniper::FieldError::new(format!("Requirement breached: {}", $reason), ::juniper::Value::null()))
        }
    };
    ($pred:expr) => {
        if !($pred) {
            return Err(::juniper::FieldError::new(format!("Requirement breached: {}", stringify!($pred)), ::juniper::Value::null()))
        }
    };
}

macro_rules! dbtry {
    ($res:expr) => {
        $res.map_err(|s| ::juniper::FieldError::new(s, ::juniper::Value::null()))
    };
}