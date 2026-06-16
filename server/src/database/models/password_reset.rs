use chrono::NaiveDateTime;
use diesel::Queryable;

#[derive(Queryable, Clone, Debug)]
pub struct PasswordReset {
    pub verification_code: String,
    pub user_id: i32,
    #[expect(dead_code)]
    pub used: bool,
    #[expect(dead_code)]
    pub created: NaiveDateTime,
    #[expect(dead_code)]
    pub expires: NaiveDateTime,
}
