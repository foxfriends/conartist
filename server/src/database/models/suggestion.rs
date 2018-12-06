//! The Suggestions table
use chrono::NaiveDateTime;
use diesel::Queryable;

#[allow(dead_code)]
#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub enum SuggestionStatus {
    Open,
    InProgress,
    Implemented,
    Cancelled,
}

#[derive(Queryable, Clone, Debug)]
pub struct Suggestion {
    pub suggestion_id: i32,
    pub user_id: i32,
    pub suggestion: String,
    pub create_date: NaiveDateTime,
    pub status: i32,
}

impl Suggestion {
    pub fn with_score(self, ranking: i64) -> ScoredSuggestion {
        ScoredSuggestion {
            suggestion_id: self.suggestion_id,
            user_id: self.user_id,
            suggestion: self.suggestion,
            create_date: self.create_date,
            status: self.status,
            ranking,
        }
    }
}

#[derive(Queryable, Clone, Debug)]
pub struct ScoredSuggestion {
    pub suggestion_id: i32,
    pub user_id: i32,
    pub suggestion: String,
    pub create_date: NaiveDateTime,
    pub status: i32,
    pub ranking: i64,
}
