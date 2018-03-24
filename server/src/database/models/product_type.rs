//! The ProductTypes table

#[derive(Queryable, Clone)]
pub struct ProductType {
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub color: i32,
    pub discontinued: bool,
}
