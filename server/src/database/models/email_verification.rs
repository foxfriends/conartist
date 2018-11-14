use chrono::NaiveDateTime;
#[derive(Queryable, Clone, Debug)]
pub struct EmailVerification {
    pub verification_code: String,
    pub user_id: i32,
    pub email: String,
    pub created: NaiveDateTime,
    pub expires: NaiveDateTime,
}
