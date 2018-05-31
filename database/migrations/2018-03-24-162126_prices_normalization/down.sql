ALTER TABLE Prices RENAME TO Prices___Backup;

CREATE TABLE Prices (
  price_id    SERIAL PRIMARY KEY,
  user_id     INT          REFERENCES Users             (user_id)     ON DELETE CASCADE,
  user_con_id INT          REFERENCES User_Conventions  (user_con_id) ON DELETE CASCADE,
  type_id     INT NOT NULL REFERENCES ProductTypes      (type_id)     ON DELETE CASCADE,
  product_id  INT          REFERENCES Products          (product_id)  ON DELETE CASCADE,
  prices      JSON NOT NULL, -- [#Quantity#, "Money"][]
  CONSTRAINT user_or_con CHECK (
    (user_id IS NOT NULL AND user_con_id IS NULL) OR
    (user_id IS NULL AND user_con_id IS NOT NULL)
  )
  -- TODO: would be nice to check that all quantities and prices >= 0
);
CREATE INDEX index_Prices_con ON Prices (user_con_id);
CREATE INDEX index_Prices_user ON Prices (user_id);
COMMENT ON TABLE Prices IS 'Records how much each product or product type should cost, for a user or for a specific convention';

  INSERT INTO Prices (user_id, type_id, product_id, prices)
  SELECT user_id, 
         type_id, 
         product_id, 
         array_to_json(array_agg(json_build_array(quantity, prices))) as prices 
    FROM prices___backup 
GROUP BY (user_id, type_id, product_id);

DROP TABLE Prices___Backup;
