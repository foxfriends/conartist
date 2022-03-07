use super::schema::{prices, suggestions, suggestionvotes};
use diesel::{allow_tables_to_appear_in_same_query, table};

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
    conventionsearch (con_id) {
        con_id -> Int4,
        title -> Varchar,
        start_date -> Date,
        end_date -> Date,
        predecessor -> Nullable<Int4>,
        country -> Varchar,
        city -> Varchar,
    }
}

table! {
    emailsinuse (email) {
        email -> Text,
    }
}

allow_tables_to_appear_in_same_query!(suggestions, scoredsuggestions,);

allow_tables_to_appear_in_same_query!(suggestionvotes, scoredsuggestions,);
allow_tables_to_appear_in_same_query!(prices, currentprices,);
