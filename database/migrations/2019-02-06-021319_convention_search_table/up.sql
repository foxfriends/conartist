CREATE MATERIALIZED VIEW ConventionSearch AS
    SELECT c.con_id, title, start_date, end_date, predecessor, country, city
      FROM Conventions c
INNER JOIN
    (
      SELECT con_id,
             array_to_json(array[info])->>0 AS country
        FROM ConventionExtraInfo
       WHERE title = 'Country'
    ) n
        ON c.con_id = n.con_id
INNER JOIN
    (
      SELECT con_id,
             array_to_json(array[info])->>0 AS city
        FROM ConventionExtraInfo
       WHERE title = 'City'
    ) t
        ON c.con_id = t.con_id;
