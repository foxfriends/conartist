use postgres::types::{FromSql, ToSql, MONEY, INT8, Type, IsNull};
use juniper::Value;
use std::error::Error;
use std::str::FromStr;

#[derive(Clone, Copy, Debug, PartialEq, PartialOrd)]
pub struct Money(pub f64);

graphql_scalar!(Money {
    // TODO: improve when proper currency support is added
    description: "Represents a monetary value and a currency as a string"

    resolve(&self) -> Value {
        Value::string(format!("${}", self.0))
    }

    from_input_value(v: &InputValue) -> Option<Money> {
        v   .as_string_value()
            .map(|s| s[1..].to_string())
            .and_then(|s| FromStr::from_str(&s).ok())
            .map(|s| Money(s))
    }
});

impl Into<f64> for Money {
    fn into(self) -> f64 {
        self.0
    }
}

impl FromSql for Money {
    fn from_sql(_: &Type, raw: &[u8]) -> Result<Money, Box<Error + Sync + Send>> {
        // TODO: support other currencies that aren't in dollar/cent
        <i64 as FromSql>::from_sql(&INT8, raw).map(|r| Money(r as f64 / 100f64))
    }

    accepts!(MONEY);
}

impl ToSql for Money {
    fn to_sql(&self, _: &Type, out: &mut Vec<u8>) -> Result<IsNull, Box<Error + 'static + Sync + Send>> {
        ((self.0 * 100f64) as i64).to_sql(&INT8, out)
    }

    accepts!(MONEY);

    to_sql_checked!();
}
