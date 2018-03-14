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
            let sold: i32 = query!(conn, "
                  SELECT COUNT(1) as sold
                    FROM (
                    SELECT UNNEST(products) AS product_id
                      FROM Records
                     WHERE user_id = $1
                    ) a
                  WHERE product_id = $2
            ", user_id, product_id)
                .into_iter()
                .map(|r| r.get::<&'static str, i32>("sold"))
                .nth(0)
                .unwrap_or(0);

            let total: i32 = query!(conn, "
                    SELECT SUM(COALESCE(quantity, 0)) as quantity
                      FROM Products p 
           LEFT OUTER JOIN Inventory i 
                        ON p.product_id = i.product_id
                     WHERE user_id = $1
                       AND p.product_id = $2
                  GROUP BY p.product_id
                ", user_id, product_id)
                    .into_iter()
                    .map(|r| r.get::<&'static str, i32>("quantity"))
                    .nth(0)
                    .unwrap_or(0);

            let quantity_delta = quantity - (total - sold);
            execute!(trans, "
                INSERT INTO Inventory 
                    (user_id, product_id, quantity) 
                VALUES
                    ($1, $2, $3)
            ", user_id, product_id, quantity_delta)
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

    pub fn update_convention_user_info_vote(&self, maybe_user_id: Option<i32>, info_id: i32, approved: bool) -> Result<ConventionUserInfo, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;

        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();

        execute!(trans, "
            INSERT INTO ConventionInfoRatings
                (user_id, con_info_id, rating)
            VALUES
                ($1, $2, $3)
            ON CONFLICT (con_info_id, user_id) DO UPDATE
               SET rating = $3
        ", user_id, info_id, approved)
            .or(Err(format!("Could not set the rating for info {}", info_id)))?;

        let info = query!(trans, "
                SELECT i.con_info_id, 
                       information, 
                       SUM(CASE rating WHEN true THEN 1 ELSE 0 END)::INT as upvotes,
                       SUM(CASE rating WHEN false THEN 1 ELSE 0 END)::INT as downvotes
                  FROM ConventionInfo i
            INNER JOIN ConventionInfoRatings r
                    ON i.con_info_id = r.con_info_id
                 WHERE i.con_info_id = $1
              GROUP BY i.con_info_id
        ", info_id)
            .into_iter()
            .nth(0)
            .ok_or_else(|| format!("No convention info exists with id {}", info_id))
            .and_then(|r| ConventionUserInfo::without_votes(r))?;
        trans.commit().unwrap();
        Ok(info)
    }
}
