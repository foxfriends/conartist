use super::*;
use bcrypt;

impl Database {
    pub fn set_user_email(&self, user_id: i32, email: String) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        for row in &query!(conn, "UPDATE Users SET email = $1 WHERE user_id = $2 RETURNING *", email, user_id) {
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

    pub fn set_user_name(&self, user_id: i32, name: String) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        for row in &query!(conn, "UPDATE Users SET name = $1 WHERE user_id = $2 RETURNING *", name, user_id) {
            return User::from(row);
        }
        return Err(format!("No user {} exists", user_id))
    }

    pub fn add_user_keys(&self, user_id: i32, quantity: i32) -> Result<User, String> {
        let conn = self.pool.get().unwrap();
        for row in &query!(conn, "UPDATE Users SET keys = keys + $1 WHERE user_id = $2 RETURNING *", quantity, user_id) {
            return User::from(row);
        }
        return Err(format!("No user {} exists", user_id))
    }
}
