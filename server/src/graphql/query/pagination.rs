//! Provides a wrapper for paginated results
use juniper::GraphQLType;

use database::Database;
use database::models::*;

#[derive(Clone)]
pub struct Pagination<T: GraphQLType + Clone> {
    pub page: i32,
    pub pages: i32,
    pub data: Vec<T>,
}

impl<T: GraphQLType + Clone> Pagination<T> {
    pub fn new(data: Vec<T>, page: i32, total: usize, per_page: i32) -> Self {
        let mut pages = total / per_page as usize;
        if total % per_page as usize > 1 { pages += 1; }
        Pagination{ page, pages: pages as i32, data }
    }
}

graphql_object!(Pagination<Convention>: Database as "ConventionPages" |&self| {
    description: "Provides a wrapper for paginated conventions"

    field page() -> i32 { self.page }
    field pages() -> i32 { self.pages }
    field data() -> &Vec<Convention> { &self.data }
});
