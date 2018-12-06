use diesel::{table, allow_tables_to_appear_in_same_query};
use super::schema::{prices, suggestions, suggestionvotes};

table! {
    currentprices (mod_date) {
        mod_date -> Timestamp,
        type_id -> Integer,
        product_id -> Nullable<Integer>,
        user_id -> Integer,
        quantity -> Integer,
    }
}

table! {
    scoredsuggestions (suggestion_id) {
        suggestion_id -> Int4,
        user_id -> Int4,
        suggestion -> Text,
        create_date -> Timestamptz,
        status -> Int4,
        ranking -> Int8,
    }
}

table! {
    emailsinuse (email) {
        email -> Text,
    }
}

allow_tables_to_appear_in_same_query!(
    suggestions,
    scoredsuggestions,
);

allow_tables_to_appear_in_same_query!(
    suggestionvotes,
    scoredsuggestions,
);
allow_tables_to_appear_in_same_query!(
    prices,
    currentprices,
);
