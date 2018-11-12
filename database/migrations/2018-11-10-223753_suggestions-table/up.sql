CREATE TABLE Suggestions (
  suggestion_id SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES Users (user_id) ON DELETE SET NULL,
  suggestion    TEXT NOT NULL,
  create_date   TIMESTAMPTZ NOT NULL DEFAULT (NOW()::TIMESTAMPTZ),
  status        INT NOT NULL DEFAULT (0) -- 0: open, 1: in progress, 2: implemented, 3: cancelled
);

CREATE TABLE SuggestionVotes (
  suggestion_id INT NOT NULL REFERENCES Suggestions (suggestion_id) ON DELETE CASCADE,
  user_id       INT NOT NULL REFERENCES Users       (user_id) ON DELETE SET NULL,
  PRIMARY KEY (suggestion_id, user_id)
);

CREATE VIEW ScoredSuggestions AS
     SELECT s.suggestion_id, s.user_id, suggestion, create_date, status, COUNT(v.user_id) AS ranking
       FROM Suggestions s
 INNER JOIN SuggestionVotes v
         ON s.suggestion_id = v.suggestion_id
   GROUP BY s.suggestion_id;
