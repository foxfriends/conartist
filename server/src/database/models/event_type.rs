use diesel_derive_enum::DbEnum;
use serde::{Deserialize, Serialize};

#[derive(DbEnum, Copy, Clone, Eq, PartialEq, Hash, Debug, Serialize, Deserialize)]
#[DieselType = "Event_type"]
pub enum EventType {
    Enabled,
    Disabled,
}
