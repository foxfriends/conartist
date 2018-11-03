ALTER TABLE Records
  ALTER COLUMN sale_time TYPE TEXT USING trim(both '"' from to_json(sale_time::timestamptz)::text),
  ALTER COLUMN sale_time SET DEFAULT (trim(both '"' from to_json(now())::text));
ALTER TABLE Expenses
  ALTER COLUMN spend_time TYPE TEXT USING trim(both '"' from to_json(spend_time::timestamptz)::text),
  ALTER COLUMN spend_time SET DEFAULT (trim(both '"' from to_json(now())::text));
