ALTER TABLE products ADD COLUMN sku VARCHAR(255);
ALTER TABLE products ADD CONSTRAINT unique_sku_per_user UNIQUE (user_id, sku);
