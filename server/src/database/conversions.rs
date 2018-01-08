use postgres::types::{FromSql, ToSql, MONEY, INT8, Type, IsNull};
use juniper::Value;
use std::error::Error;
use std::str::FromStr;
use money::{Money, Currency};

graphql_scalar!(Money {
    // TODO: improve when proper currency support is added
    description: "Represents a monetary value and a currency as a string, such as CAD150 for $1.50 in CAD"

    resolve(&self) -> Value {
        Value::string(format!("{}", self.amt()))
    }

    from_input_value(v: &InputValue) -> Option<Money> {
        v   .as_string_value()
            .and_then(|s| FromStr::from_str(&s).ok())
    }
});

impl Into<i64> for Money {
    fn into(self) -> i64 {
        self.amt()
    }
}

impl FromSql for Money {
    fn from_sql(_: &Type, raw: &[u8]) -> Result<Money, Box<Error + Sync + Send>> {
        // TODO: support other currencies that aren't in dollar/cent
        <i64 as FromSql>::from_sql(&INT8, raw).map(|r| Money::new(r, Currency::CAD))
    }

    accepts!(MONEY);
}

impl ToSql for Money {
    fn to_sql(&self, _: &Type, out: &mut Vec<u8>) -> Result<IsNull, Box<Error + 'static + Sync + Send>> {
        self.amt().to_sql(&INT8, out)
    }

    accepts!(MONEY);

    to_sql_checked!();
}
