use super::*;
use postgres_array::Array;

impl Database {
    pub fn create_user(&self, email: String, name: String, password: String) -> Result<(), String> {
        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        execute!(trans, "INSERT INTO Users (email, name, password) VALUES ($1, $2, $3)", email, name, password)
            .map_err(|r| r.to_string())
            .and_then(|r| if r == 1 { Ok(()) } else { Err("unknown".to_string()) })
            .map_err(|r| format!("Failed to create user. Reason: {}", r))?;
        trans.commit().unwrap();
        Ok(())
    }

    pub fn create_product_type(&self, maybe_user_id: Option<i32>, name: String, color: i32) -> Result<ProductType, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;

        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        for row in &query!(trans, "INSERT INTO ProductTypes (user_id, name, color) VALUES ($1, $2, $3) RETURNING *", user_id, name, color) {
            trans.set_commit();
            return ProductType::from(row)
        }
        Err(format!("Failed to create product type {}", name))
    }

    pub fn create_product(&self, maybe_user_id: Option<i32>, type_id: i32, name: String, quantity: i32) -> Result<ProductInInventory, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;

        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        let product = query!(trans, "INSERT INTO Products (user_id, type_id, name) VALUES ($1, $2, $3) RETURNING *", user_id, type_id, name)
            .into_iter()
            .nth(0)
            .ok_or_else(|| format!("Failed to create product {}", name))
            .and_then(|r| Product::from(r))?;
        for row in &query!(trans, "
                INSERT INTO Inventory
                    (user_id, product_id, quantity)
                VALUES
                    ($1, $2, $3)
                RETURNING *
            ", user_id, product.product_id, quantity) {
            trans.set_commit();
            // Bad time for unwrap, but should be ok
            return InventoryItem::from(row).map(|inv| product.in_inventory(inv));
        }
        Err(format!("Failed to create product {}", name))
    }

    pub fn create_or_update_price(&self, maybe_user_id: Option<i32>, type_id: i32, product_id: Option<i32>, prices: Array<f64>) -> Result<Price, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;

        let pid = product_id.map(|r| format!("{}", r)).unwrap_or("NULL".to_string());

        let conn = self.pool.get().unwrap();
        if let Some(price_id) =
            query!(conn, "
                SELECT price_id
                FROM Prices
                WHERE user_id = $1
                  AND type_id = $2
                  AND product_id IS NOT DISTINCT FROM $3
            ", user_id, type_id, product_id)
                .into_iter()
                .nth(0)
                .map(|r| r.get::<usize, i32>(0))
        {
            query!(conn, "UPDATE Prices SET prices = $1 WHERE price_id = $2 RETURNING *", prices, price_id)
                .into_iter()
                .nth(0)
                .ok_or("".to_string())
                .and_then(|r| Price::from(r))
                .map_err(|r| format!("Failed to update price for type {}, product {}. Reason: {}", type_id, pid, r))
        } else {
            query!(conn, "
                INSERT INTO Prices
                    (user_id, type_id, product_id, prices)
                VALUES
                    ($1, $2, $3, $4)
                RETURNING *
            ", user_id, type_id, product_id, prices)
                .into_iter()
                .nth(0)
                .ok_or("".to_string())
                .and_then(|r| Price::from(r))
                .map_err(|r| format!("Failed to create price for type {}, product {}. Reason: {}", type_id, pid, r))
        }
    }

    pub fn create_user_convention(&self, maybe_user_id: Option<i32>, con_code: String) -> Result<Convention, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;

        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        execute!(trans, "UPDATE Users SET keys = keys -1 WHERE user_id = $1 AND keys > 0", user_id)
            .map_err(|r| r.to_string())
            .and_then(|r| if r == 1 { Ok(()) } else { Err("".to_string()) })
            .map_err(|_| format!("User {} does not have enough keys to sign up for a convention", user_id))?;
        let convention = query!(trans, "SELECT * FROM Conventions WHERE code = $1 AND start_date > NOW()::TIMESTAMP", con_code)
            .into_iter()
            .nth(0)
            .ok_or_else(|| format!("No upcoming convention exists with code {}", con_code))
            .and_then(|r| Convention::from(r))?;
        execute!(trans, "INSERT INTO User_Conventions (user_id, con_id) VALUES ($1, $2) RETURNING *", user_id, convention.con_id)
            .map_err(|r| r.to_string())
            .and_then(|r| if r == 1 { Ok(()) } else { Err("unknown".to_string()) })
            .map_err(|r| format!("Failed to sign user {} up for convention {}. Reason: {}", user_id, con_code, r))?;
        trans.commit().unwrap();
        Ok(convention)
    }
}
