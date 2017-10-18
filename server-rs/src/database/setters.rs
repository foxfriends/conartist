use super::*;
use bcrypt;

impl Database {
    pub fn set_user_email(&self, user_id: i32, email: String) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        for row in &query!(trans, "UPDATE Users SET email = $1 WHERE user_id = $2 RETURNING *", email, user_id) {
            trans.set_commit();
            return User::from(row);
        }
        return Err(format!("No user {} exists", user_id))
    }

    pub fn set_user_password(&self, user_id: i32, orig_password: String, new_password: String) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        let original: String =
            query!(trans, "SELECT password FROM users WHERE user_id = $1", user_id)
                .into_iter()
                .nth(0)
                .ok_or(format!("No user {} exists", user_id))?
                .get(0);
        if !bcrypt::verify(&orig_password, &original).map_err(|_| "")? {
            return Err(format!("Not authorized to change password for user {}", user_id));
        }
        let hashed = bcrypt::hash(&new_password, bcrypt::DEFAULT_COST).map_err(|_| "Couldn't hash password??")?;
        for row in &query!(trans, "UPDATE Users SET password = $1 WHERE user_id = $2 RETURNING *", hashed, user_id) {
            trans.set_commit();
            return User::from(row);
        }
        unreachable!()
    }

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
