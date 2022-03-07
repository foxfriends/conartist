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
    pub country: String,
    pub coordinates: Coordinates,
}

impl Address {
    pub fn new(
        locality: String,
        region: Option<String>,
        country: String,
        venue: String,
        _postal_code: Option<String>,
        latitude: f32,
        longitude: f32,
    ) -> Address {
        Address {
            city: region
                .as_ref()
                .map(|region| format!("{}, {}", locality, region))
                .unwrap_or_else(|| format!("{}", locality)),
            country: format!("{}", country),
            address: region
                .as_ref()
                .map(|region| format!("{}\n{}, {}\n{}", venue, locality, region, country))
                .unwrap_or_else(|| format!("{}\n{}, {}", venue, locality, country)),
            coordinates: Coordinates {
                lat: latitude,
                lon: longitude,
            },
        }
    }
}

#[derive(Serialize, Debug)]
pub struct Convention {
    pub title: String,
    pub start_date: toml::value::Datetime,
    pub end_date: toml::value::Datetime,
    pub predecessor: Option<i32>,
    pub hours: Option<Vec<Hours>>,
    pub tags: Vec<String>,
    pub website: Website,
    pub address: Address,
}
