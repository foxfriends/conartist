ALTER TABLE DiscountProducts ADD CONSTRAINT discount_product_key UNIQUE (discount_id, product_id);
ALTER TABLE DiscountProductTypes ADD CONSTRAINT discount_product_type_key UNIQUE (discount_id, type_id);
