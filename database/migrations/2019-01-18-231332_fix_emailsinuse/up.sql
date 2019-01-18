CREATE OR REPLACE VIEW EmailsInUse AS (
  SELECT DISTINCT email
    FROM Users
   WHERE email IS NOT NULL
  UNION
  SELECT DISTINCT email
    FROM EmailVerifications
   WHERE expires > NOW()
);
