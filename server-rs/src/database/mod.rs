//! Abstraction layer around database access.

mod schema;
pub mod factory;

use juniper::Context;
use chrono::NaiveDate;
use r2d2::Pool;
use r2d2_postgres::PostgresConnectionManager;

pub use self::schema::*;
pub use self::factory::*;

#[derive(Clone)]
pub struct Database {
    pool: Pool<PostgresConnectionManager>,
    user_id: Option<i32>,
    privileged: bool,
}

// TODO: do some caching here for efficiency
// TODO: break up the module/impl when it gets big
// TODO: could totally use INNER JOIN in a lot of these places
impl Database {
    fn new(pool: Pool<PostgresConnectionManager>, id: i32) -> Self { Self{ pool, user_id: Some(id), privileged: false } }

    fn privileged(pool: Pool<PostgresConnectionManager>) -> Self { Self{ pool, user_id: None, privileged: true } }

    pub fn get_user_for_email(&self, email: &str) -> Result<User, String> {
        // TODO: make this somehow typesafe/error safe instead of runtime checked?
        //       Maybe Diesel?? Is that too much boilerplate and high DB integration?
        let conn = self.pool.get().unwrap();
        for row in &query!(conn, "SELECT * FROM Users WHERE email = $1", email) {
            return User::from(row);
        }
        return Err(format!("No user with email {} exists", email))
    }

    pub fn get_user_by_id_or_self(&self, user_id: Option<i32>) -> Result<User, String> {
        user_id
            .map(|id| self.get_user_by_id(id))
            .unwrap_or(self.get_user_by_id(self.user_id.expect("Cannot get user id for self in privileged mode!")))
    }

    pub fn get_user_by_id(&self, user_id: i32) -> Result<User, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        for row in &query!(conn, "SELECT * FROM Users WHERE user_id = $1", user_id) {
            return User::from(row);
        }
        return Err(format!("No user {} exists", user_id))
    }

    pub fn get_product_types_for_user(&self, user_id: i32) -> Result<Vec<ProductType>, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        Ok (
            query!(conn, "SELECT * FROM ProductTypes WHERE user_id = $1", user_id)
                .iter()
                .filter_map(|row| ProductType::from(row).ok())
                .collect()
        )
    }

    pub fn get_products_for_user(&self, user_id: i32) -> Result<Vec<ProductInInventory>, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        let get_inventory = conn.prepare("SELECT * FROM Inventory WHERE product_id = $1").unwrap();
        Ok (
            query!(conn, "SELECT * FROM Products WHERE user_id = $1", user_id)
                .into_iter()
                .filter_map(|row| Product::from(row).ok())
                .flat_map(|product|
                    get_inventory.query(&[&product.product_id]).unwrap()
                        .into_iter()
                        // TODO: bad use of unwrap, though probably harmless in the end
                        .map(move |row| product.clone().in_inventory(InventoryItem::from(row).unwrap()))
                        .collect::<Vec<_>>())
                .collect()
        )
    }

    pub fn get_prices_for_user(&self, user_id: i32) -> Result<Vec<Price>, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        Ok (
            query!(conn, "SELECT * FROM Prices WHERE user_id = $1", user_id)
                .iter()
                .filter_map(|row| Price::from(row).ok())
                .collect()
        )
    }

    pub fn get_conventions_for_user(&self, user_id: i32) -> Result<Vec<FullUserConvention>, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        let get_convention = conn.prepare("SELECT * FROM Conventions WHERE con_id = $1").unwrap();
        Ok (
            query!(conn, "SELECT * FROM User_Conventions WHERE user_id = $1", user_id)
                .iter()
                .filter_map(|row| UserConvention::from(row).ok())
                .flat_map(|uc|
                    get_convention.query(&[&uc.con_id]).unwrap()
                        .into_iter()
                        // TODO: bad use of unwrap, though probably harmless in the end
                        .map(move | row| uc.clone().filled_with(Convention::from(row).unwrap()))
                        .collect::<Vec<_>>())
                .collect()
        )
    }

    pub fn get_products_for_user_con(&self, user_id: i32, user_con_id: i32) -> Result<Vec<ProductInInventory>, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        let get_product = conn.prepare("SELECT * FROM Products WHERE product_id = $1").unwrap();
        Ok (
            query!(conn, "SELECT * FROM Inventory WHERE user_con_id = $1", user_con_id)
                .into_iter()
                .filter_map(|row| InventoryItem::from(row).ok())
                .flat_map(|inv|
                    get_product.query(&[&inv.product_id]).unwrap()
                        .into_iter()
                        // TODO: bad use of unwrap, though probably harmless in the end
                        .map(move |row| Product::from(row).unwrap().in_inventory(inv.clone()))
                        .collect::<Vec<_>>())
                .collect()
        )
    }

    pub fn get_prices_for_user_con(&self, user_id: i32, user_con_id: i32) -> Result<Vec<Price>, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        Ok (
            query!(conn, "SELECT * FROM Prices WHERE user_con_id = $1", user_con_id)
                .iter()
                .filter_map(|row| Price::from(row).ok())
                .collect()
        )
    }

    pub fn get_records_for_user_con(&self, user_id: i32, user_con_id: i32) -> Result<Vec<Record>, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        Ok (
            query!(conn, "SELECT * FROM Records WHERE user_con_id = $1", user_con_id)
                .iter()
                .filter_map(|row| Record::from(row).ok())
                .collect()
        )
    }

    pub fn get_expenses_for_user_con(&self, user_id: i32, user_con_id: i32) -> Result<Vec<Expense>, String> {
        assert_authorized!(self, user_id);
        let conn = self.pool.get().unwrap();
        Ok (
            query!(conn, "SELECT * FROM Expenses WHERE user_con_id = $1", user_con_id)
                .iter()
                .filter_map(|row| Expense::from(row).ok())
                .collect()
        )
    }

    pub fn get_conventions_after(&self, date: NaiveDate) -> Result<Vec<Convention>, String> {
        let conn = self.pool.get().unwrap();
        Ok (
            query!(conn, "SELECT * FROM Conventions WHERE start_date > $1", date)
                .iter()
                .filter_map(|row| Convention::from(row).ok())
                .collect()
        )
    }
}

impl Context for Database {}
