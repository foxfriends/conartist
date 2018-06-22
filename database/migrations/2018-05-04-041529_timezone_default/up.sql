ALTER TABLE Records ALTER COLUMN sale_time SET DEFAULT (now() at time zone 'utc');
ALTER TABLE Expenses ALTER COLUMN spend_time SET DEFAULT (now() at time zone 'utc');
