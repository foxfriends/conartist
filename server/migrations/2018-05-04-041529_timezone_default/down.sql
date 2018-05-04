ALTER TABLE Records ALTER COLUMN sale_time SET DEFAULT (now());
ALTER TABLE Expenses ALTER COLUMN spend_time SET DEFAULT (now());
