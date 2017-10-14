//! Type definitions for all tables in the database

pub struct User {
    user_id: usize,
    email: String,
    password: String,
    join_date: usize,
    keys: usize,
}

pub struct Convention {
    con_id: usize,
    code: String,
    title: String,
    start_date: usize,
    end_date: usize,
}

pub struct UserConvention {
    user_con_id: usize,
    user_id: usize,
    con_id: usize,
}

pub struct Product {
    product_id: usize,
    user_id: usize,
    type_id: usize,
    name: String,
    discontinued: bool,
}

pub struct ProductType {
    type_id: usize,
    user_id: usize,
    name: String,
    color: u32,
    discontinued: bool,
}

pub struct InventoryItem {
    inv_id: usize,
    user_id: Option<usize>,
    user_con_id: Option<usize>,
    product_id: usize,
    quantity: usize,
}

pub struct Price {
    price_id: usize,
    user_id: Option<usize>,
    user_con_id: Option<usize>,
    type_id: usize,
    product_id: Option<usize>,
    prices: Vec<(usize, f64)>,
}

pub struct Record {
    record_id: usize,
    user_con_id: usize,
    price: f64,
    products: Vec<usize>,
    sale_time: usize,
}

pub struct Expense {
    expense_id: usize,
    user_con_id: usize,
    price: f64,
    category: String,
    description: String,
    spend_time: usize,
}
