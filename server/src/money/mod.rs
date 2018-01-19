//! Provides a means for representing monetary values in any currency
use error::MoneyError;
use std::str::FromStr;
use std::fmt::{Display, Formatter};
use serde_json;

/// Represents a specific currency. Strings are more versatile here, but not as stable.
#[derive(Copy, Clone, PartialEq, Eq, Debug, Serialize, Deserialize)]
pub enum Currency {
    CAD,
    USD,
}
impl Display for Currency {
    fn fmt(&self, f: &mut Formatter) -> ::std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl FromStr for Currency {
    type Err = MoneyError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        serde_json::from_str(&format!("\"{}\"", s)).map_err(|_| MoneyError(format!("Could not deserialize {} as a currency code", s)))
    }
}

/// A `Money` object represents some quantity of some currency.
///
/// An integer value is used rather then a float for precision, and the currency is represented by
/// its currency code as a string. Since the amount is an integer, it will represent the smallest
/// possible denomination of that currency (i.e. cents).
///
/// In the case that fractional cents are required, an extension will need to be created. For now
/// fractional cents seem to be out of scope.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Money {
    amt: i64,
    cur: Currency, // TODO: make an enum for all the currency types?
}

impl Money {
    pub fn new(amt: i64, cur: Currency) -> Self {
        Money { amt, cur }
    }

    pub fn amt(&self) -> i64 {
        self.amt
    }

    pub fn cur(&self) -> Currency {
        self.cur
    }

    pub fn to_string(&self) -> String {
        format!("{}{}", self.cur, self.amt)
    }
}

impl Display for Money {
    fn fmt(&self, _f: &mut Formatter) -> ::std::fmt::Result {
        unimplemented!() // TODO: currency symbols and proper locale formatting
    }
}

impl PartialOrd for Money {
    fn partial_cmp(&self, other: &Self) -> Option<::std::cmp::Ordering> {
        if self.cur == other.cur {
            return Some(self.amt.cmp(&other.amt))
        } else {
            return None
        }
    }
}

impl FromStr for Money {
    type Err = MoneyError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let amt = FromStr::from_str(&s[3..]).map_err(|_| MoneyError("Could not parse amount from currency value".to_string()))?;
        let cur = FromStr::from_str(&s[..3])?;
        Ok(Money::new(amt, cur))
    }
}
