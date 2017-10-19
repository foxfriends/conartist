use super::*;

impl Database {
    pub fn delete_price(&self, maybe_user_id: Option<i32>, type_id: i32, product_id: Option<i32>) -> Result<(), String> {
        self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        if let Some(pid) = product_id {
            execute!(conn, "DELETE FROM Prices WHERE type_id = $1 AND product_id = $2", type_id, pid)
                .map_err(|r| format!("Failed to delete price for type {}, product {}. Reason: {}", type_id, pid, r))
        } else {
            execute!(conn, "DELETE FROM Prices WHERE type_id = $1 AND product_id IS NULL", type_id)
                .map_err(|r| format!("Failed to delete price for type {}. Reason: {}", type_id, r))
        }   .map(|_| ())
    }
}
