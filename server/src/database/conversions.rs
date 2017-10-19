use postgres::types::{FromSql, ToSql, MONEY, FLOAT8, Type, IsNull};
use juniper::{Value};
use std::error::Error;

#[derive(Clone, Copy, Debug)]
pub struct Money(pub f64);

graphql_scalar!(Money {
    description: "Represents a monitary value as a float"

    resolve(&self) -> Value {
        Value::float(self.0)
    }

    from_input_value(v: &InputValue) -> Option<Money> {
        v.as_float_value().map(|s| Money(s.to_owned()))
    }
});

impl Into<f64> for Money {
    fn into(self) -> f64 {
        self.0
    }
}

impl FromSql for Money {
    fn from_sql(_: &Type, raw: &[u8]) -> Result<Money, Box<Error + Sync + Send>> {
        <f64 as FromSql>::from_sql(&FLOAT8, raw).map(|r| Money(r))
    }

    accepts!(MONEY);
}

impl ToSql for Money {
    fn to_sql(&self, _: &Type, out: &mut Vec<u8>) -> Result<IsNull, Box<Error + 'static + Sync + Send>> {
        self.0.to_sql(&FLOAT8, out)
    }

    accepts!(MONEY);

    to_sql_checked!();
}
