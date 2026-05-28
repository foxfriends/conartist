CREATE TABLE Discounts (
  discount_id       SERIAL PRIMARY KEY,
  user_id           INT NOT NULL REFERENCES Users (user_id) ON DELETE CASCADE,
  flat_amount       CHAR(23),
  percentage_amount DOUBLE PRECISION,
  CHECK (flat_amount IS NULL OR percentage_amount IS NULL),
  CHECK (flat_amount IS NOT NULL OR percentage_amount IS NOT NULL)
);

CREATE TABLE DiscountProducts (
  discount_product_id SERIAL PRIMARY KEY,
  discount_id INT NOT NULL REFERENCES Discounts (discount_id) ON DELETE CASCADE,
  product_id  INT NOT NULL REFERENCES Products (product_id) ON DELETE CASCADE
);

CREATE TABLE DiscountProductTypes (
  discount_product_type_id SERIAL PRIMARY KEY,
  discount_id INT NOT NULL REFERENCES Discounts (discount_id) ON DELETE CASCADE,
  type_id     INT NOT NULL REFERENCES ProductTypes (type_id) ON DELETE CASCADE
);
