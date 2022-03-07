use chrono::NaiveDateTime;
use diesel::Queryable;

#[derive(Queryable, Clone, Debug)]
pub struct EmailVerification {
    pub verification_code: String,
    pub user_id: i32,
    pub email: String,
    pub created: NaiveDateTime,
    pub expires: NaiveDateTime,
}
