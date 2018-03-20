use super::*;
use chrono::Utc;

impl Database {
    pub fn delete_price(&self, maybe_user_id: Option<i32>, type_id: i32, product_id: Option<i32>) -> Result<bool, String> {
        self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        if let Some(pid) = product_id {
            execute!(conn, "DELETE FROM Prices WHERE type_id = $1 AND product_id = $2", type_id, pid)
                .map_err(|r| format!("Failed to delete price for type {}, product {}. Reason: {}", type_id, pid, r))
        } else {
            execute!(conn, "DELETE FROM Prices WHERE type_id = $1 AND product_id IS NULL", type_id)
                .map_err(|r| format!("Failed to delete price for type {}. Reason: {}", type_id, r))
        }   .map(|r| r == 1)
    }

    pub fn delete_record(&self, maybe_user_id: Option<i32>, record_id: i32) -> Result<bool, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        let record = query!(trans, "
            SELECT * 
              FROM Records
             WHERE record_id = $1
               AND user_id = $2
        ", record_id, user_id)
            .into_iter()
            .nth(0)
            .ok_or_else(|| format!("User {} does not own a record with id {}", user_id, record_id))
            .and_then(Record::from)?;
        let convention = query!(trans, "SELECT * FROM Conventions WHERE con_id = $1", record.con_id)
            .into_iter()
            .nth(0)
            .ok_or_else(|| format!("No convention exists with id {}", record.con_id))
            .and_then(|r| Convention::from(r))?;

        if convention.end_date.and_hms(23, 59, 59) < Utc::now().naive_utc() {
            return Err(format!("Convention '{}' ({}) has ended", convention.title, record.con_id));
        }
        let ok = execute!(trans, "
         DELETE FROM Records
               WHERE record_id = $1 
                 AND user_id = $2
        ", record_id, user_id)
            .map_err(|r| format!("Failed to delete record with id {}. Reason: {}", record_id, r))
            .map(|r| r == 1)?;
        trans.commit().unwrap();
        Ok(ok)
    }

    pub fn delete_expense(&self, maybe_user_id: Option<i32>, expense_id: i32) -> Result<bool, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();
        let expense = query!(trans, "
            SELECT * 
              FROM Expenses
             WHERE expense_id = $1
               AND user_id = $2
        ", expense_id, user_id)
            .into_iter()
            .nth(0)
            .ok_or_else(|| format!("Use {} does not own an expense with id {}", user_id, expense_id))
            .and_then(Expense::from)?;
        let convention = query!(trans, "SELECT * FROM Conventions WHERE con_id = $1", expense.con_id)
            .into_iter()
            .nth(0)
            .ok_or_else(|| format!("No convention exists with id {}", expense.con_id))
            .and_then(|r| Convention::from(r))?;

        if convention.end_date.and_hms(23, 59, 59) < Utc::now().naive_utc() {
            return Err(format!("Convention '{}' ({}) has ended", convention.title, expense.con_id));
        }
        let ok = execute!(trans, "
         DELETE FROM Expenses
               WHERE expense_id = $1
                 AND user_id = $2
        ", expense_id, user_id)
            .map_err(|r| format!("Failed to delete expense with id {}. Reason: {}", expense_id, r))
            .map(|r| r == 1)?;
        trans.commit().unwrap();
        Ok(ok)
    }

    pub fn delete_user_convention(&self, maybe_user_id: Option<i32>, con_id: i32) -> Result<bool, String> {
        let user_id = self.resolve_user_id(maybe_user_id)?;
        let conn = self.pool.get().unwrap();
        let trans = conn.transaction().unwrap();

        let convention = query!(trans, "SELECT * FROM Conventions WHERE con_id = $1 AND start_date > NOW()::TIMESTAMP", con_id)
            .into_iter()
            .nth(0)
            .ok_or_else(|| format!("No upcoming convention exists with id {}", con_id))
            .and_then(|r| Convention::from(r))?;
        execute!(trans, "DELETE FROM User_Conventions WHERE user_id = $1 AND con_id = $2", user_id, convention.con_id)
            .map_err(|r| r.to_string())
            .and_then(|r| if r == 1 { Ok(()) } else { Err("".to_string()) })
            .map_err(|_| format!("User {} was not signed up for convention {}", user_id, con_id))?;
        execute!(trans, "UPDATE Users SET keys = keys + 1 WHERE user_id = $1", user_id)
            .map_err(|r| r.to_string())
            .and_then(|r| if r == 1 { Ok(()) } else { Err("".to_string()) })
            .map_err(|_| format!("Could not return key to user {}", user_id))?;
        trans.commit().unwrap();
        Ok(true)
    }
}
