use crate::money::Money;
use chrono::NaiveDateTime;
use diesel::Queryable;

#[derive(Clone, Queryable, Debug)]
pub struct DiscountRow {
    pub discount_id: i32,
    pub user_id: i32,
    pub flat_amount: Option<Money>,
    pub percentage_amount: Option<f64>,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

impl DiscountRow {
    pub fn with(self, product_ids: Vec<i32>, product_type_ids: Vec<i32>) -> Discount {
        Discount {
            discount_id: self.discount_id,
            user_id: self.user_id,
            name: self.name,
            flat_amount: self.flat_amount,
            percentage_amount: self.percentage_amount,
            created_at: self.created_at,
            deleted_at: self.deleted_at,
            product_ids,
            product_type_ids,
        }
    }
}

#[derive(Clone, Queryable, Debug)]
pub struct Discount {
    pub discount_id: i32,
    pub user_id: i32,
    pub flat_amount: Option<Money>,
    pub percentage_amount: Option<f64>,
    pub name: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
    pub product_ids: Vec<i32>,
    pub product_type_ids: Vec<i32>,
}

#[derive(Clone, Queryable, Debug)]
pub struct DiscountProduct {
    pub discount_id: i32,
    pub product_id: i32,
}

#[derive(Clone, Queryable, Debug)]
pub struct DiscountProductType {
    pub discount_id: i32,
    pub type_id: i32,
}
