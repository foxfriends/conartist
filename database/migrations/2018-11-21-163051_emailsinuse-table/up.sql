CREATE VIEW EmailsInUse AS (
  SELECT DISTINCT COALESCE(u.email, e.email) AS email
    FROM users u, emailverifications e
   WHERE e.expires > NOW()
);
