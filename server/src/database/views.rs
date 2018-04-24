use super::schema::prices;

table! {
    currentprices (mod_date) {
        mod_date -> Timestamp,
        type_id -> Integer,
        product_id -> Nullable<Integer>,
        user_id -> Integer,
        quantity -> Integer,
    }
}

allow_tables_to_appear_in_same_query!(
    prices,
    currentprices,
);
