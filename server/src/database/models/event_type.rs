use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};

#[derive(DbEnum, Copy, Clone, Eq, PartialEq, Hash, Debug, Serialize, Deserialize)]
#[ExistingTypePath = "crate::database::schema::sql_types::EventType"]
pub enum EventType {
    Enabled,
    Disabled,
}
