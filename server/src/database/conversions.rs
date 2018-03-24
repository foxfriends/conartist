use std::io::Write;
use diesel::pg::Pg;
use diesel::sql_types::Text;
use diesel::deserialize::{self, FromSql};
use diesel::serialize::{self, Output, ToSql};
use juniper::Value;
use std::error::Error;
use std::str::FromStr;
use money::{Money, Currency};

graphql_scalar!(Money {
    // TODO: improve when proper currency support is added
    description: "Represents a monetary value and a currency as a string, such as CAD150 for $1.50 in CAD"

    resolve(&self) -> Value {
        Value::string(self.to_string())
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

impl FromSql<Text, Pg> for Money {
    fn from_sql(bytes: Option<&[u8]>) -> deserialize::Result<Self> {
        let string: String = FromSql::<Text, Pg>::from_sql(bytes)?;
        FromStr::from_str(&string).map_err(|_| format!("Could not parse Money from {}", string).into())
    }
}

impl ToSql<Text, Pg> for Money {
    fn to_sql<W: Write>(&self, w: &mut Output<W, Pg>) -> serialize::Result {
        self.to_string().to_sql(w)
    }
}

graphql_scalar!(Currency {
    // TODO: improve when proper currency support is added
    description: "Represents a type of currency"

    resolve(&self) -> Value {
        Value::string(self.to_string())
    }

    from_input_value(v: &InputValue) -> Option<Currency> {
        v   .as_string_value()
            .and_then(|s| FromStr::from_str(&s).ok())
    }
});

impl FromSql<Text, Pg> for Currency {
    fn from_sql(bytes: Option<&[u8]>) -> deserialize::Result<Self> {
        let string: String = FromSql::<Text, Pg>::from_sql(bytes)?;
        FromStr::from_str(&string).map_err(|_| format!("Could not parse Currency from {}", string).into())
    }
}

impl ToSql<Text, Pg> for Currency {
    fn to_sql<W: Write>(&self, w: &mut Output<W, Pg>) -> serialize::Result {
        self.to_string().to_sql(w)
    }
}

