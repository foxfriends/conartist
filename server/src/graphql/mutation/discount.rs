//! Input objects needed to modify convention expense
use crate::money::Money;
use juniper::GraphQLInputObject;

#[derive(Clone, GraphQLEnum)]
pub enum DiscountAppliesTo {
    All,
    Products,
    ProductTypes,
}

impl DiscountAppliesTo {
    pub fn apply(&self, ids: Vec<i32>) -> (Vec<i32>, Vec<i32>) {
        match self {
            Self::All => (vec![], vec![]),
            Self::Products => (ids, vec![]),
            Self::ProductTypes => (vec![], ids),
        }
    }
}

#[derive(Clone, GraphQLInputObject)]
#[graphql(description = "Information required to create a discount")]
pub struct DiscountAdd {
    pub name: String,
    pub flat_amount: Option<Money>,
    pub percentage_amount: Option<f64>,
    pub applies_to: DiscountAppliesTo,
    pub applies_to_ids: Option<Vec<i32>>,
}
