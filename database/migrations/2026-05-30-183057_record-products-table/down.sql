ALTER TABLE Records ADD COLUMN products INT[] NOT NULL DEFAULT '{}';

WITH RecordAgg AS (
  SELECT record_id, ARRAY_AGG(product_id) as products 
  FROM RecordProducts
  GROUP BY record_id
)
UPDATE Records
  SET products = RecordAgg.products
  FROM RecordAgg
  WHERE Records.record_id = RecordAgg.record_id;

DROP TABLE RecordProducts;
ALTER TABLE Records ALTER COLUMN products SET NOT NULL;
