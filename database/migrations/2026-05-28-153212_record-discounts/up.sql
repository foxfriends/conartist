ALTER TABLE Discounts ADD COLUMN IF NOT EXISTS name VARCHAR(512) NOT NULL DEFAULT 'Unnamed Discount';
ALTER TABLE Discounts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
ALTER TABLE Discounts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

CREATE VIEW CurrentDiscounts AS
     SELECT user_id, name, MAX(created_at) as created_at
       FROM Discounts
   GROUP BY user_id, name;

CREATE TABLE RecordDiscounts (
  record_discount_id SERIAL PRIMARY KEY,
  record_id INT NOT NULL REFERENCES Records (record_id) ON DELETE CASCADE,
  discount_id INT NOT NULL REFERENCES Discounts (discount_id) ON DELETE RESTRICT
);
