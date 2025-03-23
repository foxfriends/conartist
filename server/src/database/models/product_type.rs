//! The ProductTypes table
use super::super::schema::*;
use diesel::{AsChangeset, Queryable};

#[derive(Queryable, Clone, Debug)]
pub struct ProductType {
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub color: Option<i32>,
    pub sort: i32,
    pub deleted: bool,
}

#[derive(AsChangeset, Debug)]
#[diesel(table_name = producttypes)]
pub struct ProductTypeChange {
    pub name: Option<String>,
    pub color: Option<i32>,
    pub sort: Option<i32>,
}

impl ProductType {
    pub fn with_snapshot_data(self, discontinued: bool) -> ProductTypeSnapshot {
        ProductTypeSnapshot {
            type_id: self.type_id,
            user_id: self.user_id,
            name: self.name,
            color: self.color,
            sort: self.sort,
            discontinued,
        }
    }
}

#[derive(Clone, Debug)]
pub struct ProductTypeSnapshot {
    pub type_id: i32,
    pub user_id: i32,
    pub name: String,
    pub color: Option<i32>,
    pub discontinued: bool,
    pub sort: i32,
}
