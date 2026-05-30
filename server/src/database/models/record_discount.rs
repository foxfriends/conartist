use diesel::Queryable;

#[derive(Queryable, Clone, Debug)]
pub struct RecordDiscount {
    pub record_discount_id: i32,
    pub record_id: i32,
    pub discount_id: i32,
}
