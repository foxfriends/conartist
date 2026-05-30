CREATE TABLE RecordProducts (
  record_product_id SERIAL PRIMARY KEY,
  record_id INT NOT NULL REFERENCES Records (record_id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES Products (product_id) ON DELETE RESTRICT
);

INSERT INTO RecordProducts (record_id, product_id)
  SELECT record_id, unnest(products)
  FROM records;

ALTER TABLE Records DROP COLUMN products;
