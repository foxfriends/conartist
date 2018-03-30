//! The ProductTypes table
use super::super::schema::*;

#[derive(Queryable, Clone)]
pub struct ProductType {
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub color: Option<i32>,
    pub discontinued: bool,
}

#[derive(AsChangeset)]
#[table_name="producttypes"]
pub struct ProductTypeChange {
    pub name: Option<String>,
    pub color: Option<i32>,
    pub discontinued: Option<bool>,
}
