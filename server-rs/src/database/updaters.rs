use super::*;

impl Database {
    pub fn update_product_type(&self,
        maybe_user_id: Option<i32>,
        type_id: i32,
        name: Option<String>,
        color: Option<i32>,
        discontinued: Option<bool>,
    ) -> Result<ProductType, String> {
        self.resolve_user_id(maybe_user_id)?;

        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        if let Some(name) = name {
            execute!(trans, "UPDATE ProductTypes SET name = $1 WHERE type_id = $2", name, type_id)
                .or(Err(format!("Could not set name of product type {} to {}", type_id, name)))?;
        }
        if let Some(color) = color {
            execute!(trans, "UPDATE ProductTypes SET color = $1 WHERE type_id = $2", color, type_id)
                .or(Err(format!("Could not set color of product type {} to {}", type_id, color)))?;
        }
        if let Some(discontinued) = discontinued {
            execute!(trans, "UPDATE ProductTypes SET discontinued = $1 WHERE type_id = $2", discontinued, type_id)
                .or(Err(format!("Could not set discontinued of product type {} to {}", type_id, discontinued)))?;
        }
        trans.commit().unwrap();
        query!(conn, "SELECT * FROM ProductTypes WHERE type_id = $1", type_id)
            .into_iter()
            .map(|r| ProductType::from(r))
            .nth(0)
            .unwrap_or(Err("Could not retrieve updated product type".to_string()))
    }

    pub fn update_product(&self,
        maybe_user_id: Option<i32>,
        product_id: i32,
        name: Option<String>,
        quantity: Option<i32>,
        discontinued: Option<bool>,
    ) -> Result<ProductInInventory, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;

        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        if let Some(name) = name {
            execute!(trans, "UPDATE Products SET name = $1 WHERE product_id = $2", name, product_id)
                .or(Err(format!("Could not set name of product {} to {}", product_id, name)))?;
        }
        if let Some(quantity) = quantity {
            execute!(trans, "UPDATE Inventory SET quantity = $1 WHERE user_id = $2 AND product_id = $3", quantity, user_id, product_id)
                .or(Err(format!("Could not set quantity of product {} to {}", product_id, quantity)))?;
        }
        if let Some(discontinued) = discontinued {
            execute!(trans, "UPDATE Products SET discontinued = $1 WHERE product_id = $2", discontinued, product_id)
                .or(Err(format!("Could not set discontinued of product {} to {}", product_id, discontinued)))?;
        }
        trans.commit().unwrap();
        query!(conn, "
            SELECT *
            FROM Products p INNER JOIN Inventory i ON p.product_id = i.product_id
            WHERE p.user_id = $1
              AND p.product_id = $2
            ", user_id, product_id)
            .into_iter()
            .nth(0)
            .ok_or("Could not retrieve updated product".to_string())
            .and_then(|r| ProductInInventory::from(r))
    }
}
