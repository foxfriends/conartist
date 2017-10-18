use super::*;

impl Database {
    pub fn update_product_type(&self,
        maybe_user_id: Option<i32>,
        type_id: i32, name: Option<String>,
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
            .unwrap()
    }
}
