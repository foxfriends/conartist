//! Provides a number of useful macros for assorted purposes
// TODO: should these be placed in meaningful locations? Or is just "around" ok because they are
//       macros

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
        if !$db.privileged && Some($id) != $db.user_id {
            return Err(format!("Not authorized to access user {}", $id));
        }
    };
}

macro_rules! ensure {
    ($pred:expr, $reason:expr) => {
        if !($pred) {
            return Err(::juniper::FieldError::new(
                format!("Requirement breached: {}", $reason),
                ::juniper::Value::null(),
            ));
        }
    };
    ($pred:expr) => {
        if !($pred) {
            return Err(::juniper::FieldError::new(
                format!("Requirement breached: {}", stringify!($pred)),
                ::juniper::Value::null(),
            ));
        }
    };
}

macro_rules! dbtry {
    ($res:expr) => {
        $res.map_err(|s| {
            use log::warn;
            warn!("DB Error: {}", s);
            ::juniper::FieldError::new(s, ::juniper::Value::null())
        })
    };
}
