// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "event_type"))]
    pub struct EventType;
}

diesel::table! {
    admins (user_id) {
        user_id -> Int4,
        clearance -> Int4,
    }
}

diesel::table! {
    conventionextrainfo (con_id, title) {
        con_id -> Int4,
        #[max_length = 64]
        title -> Varchar,
        info -> Nullable<Json>,
        action -> Nullable<Text>,
        action_text -> Nullable<Text>,
    }
}

diesel::table! {
    conventionimages (image_id) {
        image_id -> Int4,
        con_id -> Int4,
        #[max_length = 36]
        image_uuid -> Bpchar,
        create_date -> Timestamp,
    }
}

diesel::table! {
    conventioninforatings (con_info_id, user_id) {
        con_info_id -> Int4,
        user_id -> Int4,
        rating -> Bool,
    }
}

diesel::table! {
    conventionratings (con_id, user_id) {
        con_id -> Int4,
        user_id -> Int4,
        rating -> Int4,
        review -> Text,
    }
}

diesel::table! {
    conventions (con_id) {
        con_id -> Int4,
        #[max_length = 512]
        title -> Varchar,
        start_date -> Date,
        end_date -> Date,
        predecessor -> Nullable<Int4>,
    }
}

diesel::table! {
    conventionuserinfo (con_info_id) {
        con_info_id -> Int4,
        con_id -> Int4,
        user_id -> Int4,
        information -> Text,
    }
}

diesel::table! {
    emailverifications (verification_code) {
        #[max_length = 32]
        verification_code -> Bpchar,
        user_id -> Int4,
        #[max_length = 512]
        email -> Varchar,
        created -> Timestamp,
        expires -> Timestamp,
    }
}

diesel::table! {
    expenses (expense_id) {
        expense_id -> Int4,
        user_id -> Int4,
        con_id -> Int4,
        #[max_length = 23]
        price -> Bpchar,
        #[max_length = 32]
        category -> Varchar,
        description -> Text,
        spend_time -> Text,
        gen_id -> Nullable<Uuid>,
    }
}

diesel::table! {
    inventory (inventory_id) {
        inventory_id -> Int4,
        product_id -> Int4,
        quantity -> Int4,
        mod_date -> Timestamp,
    }
}

diesel::table! {
    passwordresets (verification_code) {
        #[max_length = 32]
        verification_code -> Bpchar,
        user_id -> Int4,
        used -> Bool,
        created -> Timestamp,
        expires -> Timestamp,
    }
}

diesel::table! {
    prices (price_id) {
        price_id -> Int4,
        user_id -> Int4,
        type_id -> Int4,
        product_id -> Nullable<Int4>,
        quantity -> Int4,
        #[max_length = 23]
        price -> Nullable<Bpchar>,
        mod_date -> Timestamp,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::EventType;

    productevents (event_id) {
        event_id -> Int4,
        product_id -> Int4,
        event_type -> EventType,
        event_time -> Timestamp,
    }
}

diesel::table! {
    products (product_id) {
        product_id -> Int4,
        type_id -> Int4,
        user_id -> Int4,
        #[max_length = 512]
        name -> Varchar,
        sort -> Int4,
        deleted -> Bool,
        #[max_length = 255]
        sku -> Nullable<Varchar>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::EventType;

    producttypeevents (event_id) {
        event_id -> Int4,
        type_id -> Int4,
        event_type -> EventType,
        event_time -> Timestamp,
    }
}

diesel::table! {
    producttypes (type_id) {
        type_id -> Int4,
        user_id -> Int4,
        #[max_length = 512]
        name -> Varchar,
        color -> Nullable<Int4>,
        sort -> Int4,
        deleted -> Bool,
    }
}

diesel::table! {
    records (record_id) {
        record_id -> Int4,
        user_id -> Int4,
        con_id -> Nullable<Int4>,
        #[max_length = 23]
        price -> Bpchar,
        products -> Array<Nullable<Int4>>,
        info -> Text,
        sale_time -> Text,
        gen_id -> Nullable<Uuid>,
    }
}

diesel::table! {
    signinattempts (user_id, attempt_time) {
        user_id -> Int4,
        successful -> Bool,
        attempt_time -> Timestamp,
    }
}

diesel::table! {
    suggestions (suggestion_id) {
        suggestion_id -> Int4,
        user_id -> Int4,
        suggestion -> Text,
        create_date -> Timestamptz,
        status -> Int4,
    }
}

diesel::table! {
    suggestionvotes (suggestion_id, user_id) {
        suggestion_id -> Int4,
        user_id -> Int4,
    }
}

diesel::table! {
    user_conventions (user_con_id) {
        user_con_id -> Int4,
        user_id -> Int4,
        con_id -> Int4,
    }
}

diesel::table! {
    users (user_id) {
        user_id -> Int4,
        #[max_length = 512]
        email -> Nullable<Varchar>,
        #[max_length = 512]
        name -> Varchar,
        #[max_length = 512]
        password -> Varchar,
        keys -> Int4,
        join_date -> Timestamp,
    }
}

diesel::table! {
    usersettings (user_id) {
        user_id -> Int4,
        #[max_length = 3]
        currency -> Bpchar,
        #[max_length = 16]
        language -> Bpchar,
    }
}

diesel::table! {
    webhookdeletedrecord (webhook_id) {
        webhook_id -> Int4,
        user_id -> Int4,
        #[max_length = 1024]
        url -> Varchar,
    }
}

diesel::table! {
    webhooknewrecord (webhook_id) {
        webhook_id -> Int4,
        user_id -> Int4,
        #[max_length = 1024]
        url -> Varchar,
    }
}

diesel::joinable!(admins -> users (user_id));
diesel::joinable!(conventionextrainfo -> conventions (con_id));
diesel::joinable!(conventionimages -> conventions (con_id));
diesel::joinable!(conventioninforatings -> conventionuserinfo (con_info_id));
diesel::joinable!(conventioninforatings -> users (user_id));
diesel::joinable!(conventionratings -> conventions (con_id));
diesel::joinable!(conventionratings -> users (user_id));
diesel::joinable!(conventionuserinfo -> conventions (con_id));
diesel::joinable!(conventionuserinfo -> users (user_id));
diesel::joinable!(emailverifications -> users (user_id));
diesel::joinable!(inventory -> products (product_id));
diesel::joinable!(passwordresets -> users (user_id));
diesel::joinable!(prices -> products (product_id));
diesel::joinable!(prices -> producttypes (type_id));
diesel::joinable!(prices -> users (user_id));
diesel::joinable!(productevents -> products (product_id));
diesel::joinable!(products -> producttypes (type_id));
diesel::joinable!(products -> users (user_id));
diesel::joinable!(producttypeevents -> producttypes (type_id));
diesel::joinable!(producttypes -> users (user_id));
diesel::joinable!(records -> users (user_id));
diesel::joinable!(signinattempts -> users (user_id));
diesel::joinable!(suggestions -> users (user_id));
diesel::joinable!(suggestionvotes -> suggestions (suggestion_id));
diesel::joinable!(suggestionvotes -> users (user_id));
diesel::joinable!(user_conventions -> conventions (con_id));
diesel::joinable!(user_conventions -> users (user_id));
diesel::joinable!(usersettings -> users (user_id));
diesel::joinable!(webhookdeletedrecord -> users (user_id));
diesel::joinable!(webhooknewrecord -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    admins,
    conventionextrainfo,
    conventionimages,
    conventioninforatings,
    conventionratings,
    conventions,
    conventionuserinfo,
    emailverifications,
    expenses,
    inventory,
    passwordresets,
    prices,
    productevents,
    products,
    producttypeevents,
    producttypes,
    records,
    signinattempts,
    suggestions,
    suggestionvotes,
    user_conventions,
    users,
    usersettings,
    webhookdeletedrecord,
    webhooknewrecord,
);
