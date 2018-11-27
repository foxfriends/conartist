use diesel::dsl;
use diesel::prelude::*;

use super::Database;
use super::models::*;
use super::schema::*;
use super::views::*;

// TODO: do some caching here for efficiency
// TODO: handle errors more properly, returning Result<_, Error> instead of String
//       also update the dbtry! macro to resolve that problem correctly
impl Database {
    pub fn get_suggestions(&self, status: Option<SuggestionStatus>, limit: i64, after: Option<String>) -> Result<Vec<ScoredSuggestion>, String> {
        let conn = self.pool.get().unwrap();
        if let Some(status) = status {
            scoredsuggestions::table
                .filter(scoredsuggestions::status.eq(status as i32))
                .offset(after.as_ref().and_then(|s| s.parse::<i64>().ok()).unwrap_or(0i64))
                .limit(limit)
                .order((scoredsuggestions::ranking.desc(), scoredsuggestions::create_date.asc()))
                .load::<ScoredSuggestion>(&*conn)
                .map_err(|reason| format!("Suggestions with status {:?}, cursor {:?} could not be retrieved. Reason: {}", status, after, reason))
        } else {
            scoredsuggestions::table
                .filter(scoredsuggestions::status.lt(SuggestionStatus::Implemented as i32))
                .offset(after.as_ref().and_then(|s| s.parse::<i64>().ok()).unwrap_or(0i64))
                .limit(limit)
                .order((scoredsuggestions::ranking.desc(), scoredsuggestions::create_date.asc()))
                .load::<ScoredSuggestion>(&*conn)
                .map_err(|reason| format!("Suggestions with status {:?}, cursor {:?} could not be retrieved. Reason: {}", status, after, reason))
        }
    }

    pub fn count_suggestions(&self, status: Option<SuggestionStatus>) -> i64 {
        let conn = self.pool.get().unwrap();
        if let Some(status) = status {
            suggestions::table
                .select(dsl::count(suggestions::suggestion_id))
                .filter(suggestions::status.eq(status as i32))
                .first::<i64>(&*conn)
                .unwrap_or(0)
        } else {
            suggestions::table
                .select(dsl::count(suggestions::suggestion_id))
                .filter(suggestions::status.lt(SuggestionStatus::Implemented as i32))
                .first::<i64>(&*conn)
                .unwrap_or(0)
        }
    }

    pub fn check_suggestion_voted(&self, suggestion_id: i32) -> bool {
        let user_id = self.resolve_user_id(None);
        let conn = self.pool.get().unwrap();
        dsl::select(dsl::exists(suggestionvotes::table
            .filter(suggestionvotes::suggestion_id.eq(suggestion_id))
            .filter(suggestionvotes::user_id.eq(user_id))
        )).first::<bool>(&*conn)
            .unwrap_or(false)
    }

    pub fn create_suggestion(&self, suggestion: String) -> Result<ScoredSuggestion, String> {
        let user_id = self.resolve_user_id(None);
        let conn = self.pool.get().unwrap();
        diesel::insert_into(suggestions::table)
            .values((suggestions::user_id.eq(user_id), suggestions::suggestion.eq(suggestion)))
            .get_result::<Suggestion>(&*conn)
            .map(|suggestion| suggestion.with_score(0))
            .map_err(|reason| format!("Failed to create new suggestion as user with id {}. Reason: {}", user_id, reason))
    }

    pub fn vote_for_suggestion(&self, suggestion_id: i32) -> Result<ScoredSuggestion, String> {
        let user_id = self.resolve_user_id(None);
        let conn = self.pool.get().unwrap();
        conn.transaction(|| {
                diesel::insert_into(suggestionvotes::table)
                    .values((suggestionvotes::suggestion_id.eq(suggestion_id), suggestionvotes::user_id.eq(user_id)))
                    .execute(&*conn)?;
                scoredsuggestions::table
                    .filter(scoredsuggestions::suggestion_id.eq(suggestion_id))
                    .first::<ScoredSuggestion>(&*conn)
            })
            .map_err(|reason| format!("Could not vote as user with id {} on suggestion with id {}. Reason: {}", user_id, suggestion_id, reason))
    }
}
