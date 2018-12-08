use serde_derive::Serialize;

#[derive(Serialize, Debug)]
pub struct Hours {
    pub start: toml::value::Datetime,
    pub end: toml::value::Datetime,
}

#[derive(Serialize, Debug)]
pub struct Website {
    pub title: String,
    pub url: String,
}

#[derive(Serialize, Debug)]
pub struct Coordinates {
    pub lat: f32,
    pub lon: f32,
}

#[derive(Serialize, Debug)]
pub struct Address {
    pub address: String,
    pub city: String,
    pub coordinates: Coordinates,
}

#[derive(Serialize, Debug)]
pub struct Convention {
    pub title: String,
    pub start_date: toml::value::Datetime,
    pub end_date: toml::value::Datetime,
    pub predecessor: Option<i32>,
    pub hours: Option<Vec<Hours>>,
    pub website: Website,
    pub address: Address,
}
