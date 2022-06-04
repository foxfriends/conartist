//! The ProductEvents table
use chrono::NaiveDateTime;
use diesel::Queryable;
use super::EventType;

#[derive(Queryable, Clone, Debug)]
pub struct ProductEvent {
    pub event_id: i32,
    pub product_id: i32,
    pub event_time: NaiveDateTime,
    pub event_type: EventType,
}
