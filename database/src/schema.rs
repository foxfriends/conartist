table! {
    admins (user_id) {
        user_id -> Int4,
        clearance -> Int4,
    }
}

table! {
    conventionextrainfo (con_id, title) {
        con_id -> Int4,
        title -> Varchar,
        info -> Nullable<Json>,
        action -> Nullable<Text>,
        action_text -> Nullable<Text>,
    }
}

table! {
    conventionimages (image_id) {
        image_id -> Int4,
        con_id -> Int4,
        image_uuid -> Bpchar,
        create_date -> Timestamp,
    }
}

table! {
    conventioninforatings (con_info_id, user_id) {
        con_info_id -> Int4,
        user_id -> Int4,
        rating -> Bool,
    }
}

table! {
    conventionratings (con_id, user_id) {
        con_id -> Int4,
        user_id -> Int4,
        rating -> Int4,
        review -> Text,
    }
}

table! {
    conventions (con_id) {
        con_id -> Int4,
        title -> Varchar,
        start_date -> Date,
        end_date -> Date,
        predecessor -> Nullable<Int4>,
    }
}

table! {
    conventionuserinfo (con_info_id) {
        con_info_id -> Int4,
        con_id -> Int4,
        user_id -> Int4,
        information -> Text,
    }
}

table! {
    emailverifications (verification_code) {
        verification_code -> Bpchar,
        user_id -> Int4,
        email -> Varchar,
        created -> Timestamp,
        expires -> Timestamp,
    }
}

table! {
    expenses (expense_id) {
        expense_id -> Int4,
        user_id -> Int4,
        con_id -> Int4,
        price -> Bpchar,
        category -> Varchar,
        description -> Text,
        spend_time -> Text,
        gen_id -> Nullable<Uuid>,
    }
}

table! {
    inventory (inventory_id) {
        inventory_id -> Int4,
        product_id -> Int4,
        quantity -> Int4,
        mod_date -> Timestamp,
    }
}

table! {
    passwordresets (verification_code) {
        verification_code -> Bpchar,
        user_id -> Int4,
        used -> Bool,
        created -> Timestamp,
        expires -> Timestamp,
    }
}

table! {
    prices (price_id) {
        price_id -> Int4,
        user_id -> Int4,
        type_id -> Int4,
        product_id -> Nullable<Int4>,
        quantity -> Int4,
        price -> Nullable<Bpchar>,
        mod_date -> Timestamp,
    }
}

table! {
    productevents (event_id) {
        event_id -> Int4,
        product_id -> Int4,
        event_type -> Event_type,
        event_time -> Timestamp,
    }
}

table! {
    products (product_id) {
        product_id -> Int4,
        type_id -> Int4,
        user_id -> Int4,
        name -> Varchar,
        sort -> Int4,
        deleted -> Bool,
        sku -> Nullable<Varchar>,
    }
}

table! {
    producttypeevents (event_id) {
        event_id -> Int4,
        type_id -> Int4,
        event_type -> Event_type,
        event_time -> Timestamp,
    }
}

table! {
    producttypes (type_id) {
        type_id -> Int4,
        user_id -> Int4,
        name -> Varchar,
        color -> Nullable<Int4>,
        sort -> Int4,
        deleted -> Bool,
    }
}

table! {
    records (record_id) {
        record_id -> Int4,
        user_id -> Int4,
        con_id -> Nullable<Int4>,
        price -> Bpchar,
        products -> Array<Int4>,
        info -> Text,
        sale_time -> Text,
        gen_id -> Nullable<Uuid>,
    }
}

table! {
    signinattempts (user_id, attempt_time) {
        user_id -> Int4,
        successful -> Bool,
        attempt_time -> Timestamp,
    }
}

table! {
    suggestions (suggestion_id) {
        suggestion_id -> Int4,
        user_id -> Int4,
        suggestion -> Text,
        create_date -> Timestamptz,
        status -> Int4,
    }
}

table! {
    suggestionvotes (suggestion_id, user_id) {
        suggestion_id -> Int4,
        user_id -> Int4,
    }
}

table! {
    user_conventions (user_con_id) {
        user_con_id -> Int4,
        user_id -> Int4,
        con_id -> Int4,
    }
}

table! {
    users (user_id) {
        user_id -> Int4,
        email -> Nullable<Varchar>,
        name -> Varchar,
        password -> Varchar,
        keys -> Int4,
        join_date -> Timestamp,
    }
}

table! {
    usersettings (user_id) {
        user_id -> Int4,
        currency -> Bpchar,
        language -> Bpchar,
    }
}

table! {
    webhookdeletedrecord (webhook_id) {
        webhook_id -> Int4,
        user_id -> Int4,
        url -> Varchar,
    }
}

table! {
    webhooknewrecord (webhook_id) {
        webhook_id -> Int4,
        user_id -> Int4,
        url -> Varchar,
    }
}

joinable!(admins -> users (user_id));
joinable!(conventionextrainfo -> conventions (con_id));
joinable!(conventionimages -> conventions (con_id));
joinable!(conventioninforatings -> conventionuserinfo (con_info_id));
joinable!(conventioninforatings -> users (user_id));
joinable!(conventionratings -> conventions (con_id));
joinable!(conventionratings -> users (user_id));
joinable!(conventionuserinfo -> conventions (con_id));
joinable!(conventionuserinfo -> users (user_id));
joinable!(emailverifications -> users (user_id));
joinable!(inventory -> products (product_id));
joinable!(passwordresets -> users (user_id));
joinable!(prices -> products (product_id));
joinable!(prices -> producttypes (type_id));
joinable!(prices -> users (user_id));
joinable!(productevents -> products (product_id));
joinable!(products -> producttypes (type_id));
joinable!(products -> users (user_id));
joinable!(producttypeevents -> producttypes (type_id));
joinable!(producttypes -> users (user_id));
joinable!(signinattempts -> users (user_id));
joinable!(suggestions -> users (user_id));
joinable!(suggestionvotes -> suggestions (suggestion_id));
joinable!(suggestionvotes -> users (user_id));
joinable!(user_conventions -> conventions (con_id));
joinable!(user_conventions -> users (user_id));
joinable!(usersettings -> users (user_id));
joinable!(webhookdeletedrecord -> users (user_id));
joinable!(webhooknewrecord -> users (user_id));

allow_tables_to_appear_in_same_query!(
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
