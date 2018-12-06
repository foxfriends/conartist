use chrono::NaiveDateTime;
use diesel::Queryable;

#[derive(Queryable, Clone, Debug)]
pub struct PasswordReset {
    pub verification_code: String,
    pub user_id: i32,
    pub used: bool,
    pub created: NaiveDateTime,
    pub expires: NaiveDateTime,
}
