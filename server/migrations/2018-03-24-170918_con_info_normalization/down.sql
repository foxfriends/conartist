ALTER TABLE ConventionUserInfo RENAME TO ConventionInfo;

ALTER TABLE Conventions ADD COLUMN extra_info JSON NOT NULL DEFAULT ('[]'::JSON);

CREATE TYPE x AS (title text, info json, action text, "actionText" text);

WITH new_info AS (
  SELECT con_id, 
         array_to_json(array_agg(row_to_json(cast(row(title, info, action, action_text) as x)))) as json_extra_info
    FROM ConventionExtraInfo GROUP BY con_id
  )
UPDATE Conventions 
   SET extra_info = json_extra_info::JSON
  FROM new_info
 WHERE new_info.con_id = conventions.con_id;

DROP TYPE x;

DROP TABLE ConventionExtraInfo;
