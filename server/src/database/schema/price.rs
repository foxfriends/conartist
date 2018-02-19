//! The Prices table
use std::panic::catch_unwind;
use postgres::rows::Row;
use money::Money;
use serde_json;
use std::str::FromStr;

#[derive(Clone, Copy)]
pub struct PriceRow {
    pub index: i32,
    pub user_id: Option<i32>,
    pub user_con_id: Option<i32>,
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub quantity: i32,
    pub price: Money,
}

#[derive(Clone)]
pub struct Price {
    pub price_id: i32,
    pub user_id: Option<i32>,
    pub user_con_id: Option<i32>,
    pub type_id: i32,
    pub product_id: Option<i32>,
    pub prices: Vec<(i32, Money)>,
}
impl Price {
    pub fn from(row: Row) -> Result<Self, String> {
        catch_unwind(|| {
            Self {
                price_id: row.get("price_id"),
                user_id: row.get("user_id"),
                user_con_id: row.get("user_con_id"),
                type_id: row.get("type_id"),
                product_id: row.get("product_id"),
                prices: row .get::<&'static str, serde_json::Value>("prices")
                            .as_array()
                            .map(|l|
                                l.clone().iter()
                                    .map(|vp|
                                        vp.as_array()
                                            .map(|p| (p[0].as_i64().unwrap() as i32, FromStr::from_str(p[1].as_str().unwrap()).unwrap()))
                                            .unwrap())
                                    .collect())
                            .unwrap()
            }
        }).map_err(|_| "Tried to create a Price from a non-Price row".to_string())
    }

    pub fn spread(self, index: i32) -> Vec<PriceRow> {
        self.prices
            .iter()
            .enumerate()
            .map(|(i, &(quantity, price))| PriceRow {
                index: index + i as i32,
                user_id: self.user_id,
                user_con_id: self.user_con_id,
                type_id: self.type_id,
                product_id: self.product_id,
                quantity,
                price,
            } )
            .collect()
    }
}
