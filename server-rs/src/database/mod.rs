//! Abstraction layer around database access

mod schema;
pub mod get;

use std::collections::HashMap;
use juniper::Context;

pub use self::schema::*;

pub struct Database {
    users: HashMap<usize, User>,
    conventions: HashMap<usize, Convention>,
    user_conventions: HashMap<usize, UserConvention>,
    products: HashMap<usize, Product>,
    product_types: HashMap<usize, ProductType>,
    inventory: HashMap<usize, InventoryItem>,
    prices: HashMap<usize, Price>,
    record: HashMap<usize, Record>,
}

impl Context for Database {}
