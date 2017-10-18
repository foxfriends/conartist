use super::Database;
impl Database {
    pub fn create_user(&self, email: String, name: String, password: String) -> Result<(), String> {
        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        match execute!(trans, "INSERT INTO Users (email, name, password) VALUES ($1, $2, $3)", email, name, password) {
            Ok(1) => (),
            Ok(0) => return Err("Failed to create user.".to_string()),
            Ok(_) => return Err("Something very strange happened?".to_string()),
            Err(reason) => return Err(format!("Failed to create user. Reason: {}", reason)),
        };
        trans.commit().map_err(|e| format!("{}", e))
    }
}
