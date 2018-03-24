ALTER TABLE ConventionInfo RENAME TO ConventionUserInfo;

CREATE TABLE ConventionExtraInfo (
  con_id      INT NOT NULL REFERENCES Conventions (con_id),
  title       VARCHAR(64) NOT NULL,
  info        JSON,
  action      TEXT,
  action_text TEXT,
  PRIMARY KEY (con_id, title)
);

INSERT INTO ConventionExtraInfo
SELECT con_id,
       json_array_elements(extra_info)->>'title' as title,
       json_array_elements(extra_info)->'info' as info,
       json_array_elements(extra_info)->>'action' as action,
       json_array_elements(extra_info)->>'actionText' as action_text 
  FROM Conventions;

ALTER TABLE Conventions DROP COLUMN extra_info;
