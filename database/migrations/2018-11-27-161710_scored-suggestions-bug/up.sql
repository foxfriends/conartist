CREATE OR REPLACE VIEW ScoredSuggestions AS
     SELECT s.suggestion_id, s.user_id, suggestion, create_date, status, COUNT(v.user_id) AS ranking
       FROM Suggestions s LEFT OUTER JOIN SuggestionVotes v
         ON s.suggestion_id = v.suggestion_id
   GROUP BY s.suggestion_id;
