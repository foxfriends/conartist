INSERT INTO ConventionExtraInfo (con_id, title, info)
SELECT con_id,
       'Country',
       CASE
       WHEN BTRIM(SPLIT_PART(array_to_json(ARRAY[info])->>0, ',', 2)) = ANY('{"ON", "QC", "BC", "AB", "MB", "PE", "NS", "NL", "NB", "SK", "YT", "NT", "NU"}'::TEXT[])
          THEN '"Canada"'::JSON
       ELSE '"United States"'::JSON
       END
  FROM ConventionExtraInfo
 WHERE title = 'City';
