use super::*;

impl Database {
    pub fn create_user(&self, email: String, name: String, password: String) -> Result<(), String> {
        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        match execute!(trans, "INSERT INTO Users (email, name, password) VALUES ($1, $2, $3)", email, name, password) {
            Ok(1) => trans.set_commit(),
            Ok(0) => return Err("Failed to create user.".to_string()),
            Ok(_) => return Err("Something very strange happened?".to_string()),
            Err(reason) => return Err(format!("Failed to create user. Reason: {}", reason)),
        };
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
            .ok_or(format!("Failed to create product {}", name))
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
}
