use postgres::types::{FromSql, ToSql, MONEY, INT8, Type, IsNull};
use juniper::Value;
use std::error::Error;

#[derive(Clone, Copy, Debug, PartialEq, PartialOrd)]
pub struct Money(pub f64);

graphql_scalar!(Money {
    description: "Represents a monitary value as a float"

    resolve(&self) -> Value {
        Value::float(self.0)
    }

    from_input_value(v: &InputValue) -> Option<Money> {
        v   .as_float_value()
            .or_else(|| v.as_int_value().map(|i| i as f64))
            .map(|s| Money(s.to_owned()))
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
