CREATE DATABASE conartist;

REVOKE CONNECT ON DATABASE conartist FROM PUBLIC;

CREATE ROLE conartist_admin WITH LOGIN PASSWORD 'temporary-password';
GRANT ALL PRIVILEGES ON DATABASE conartist TO conartist_admin;

CREATE ROLE conartist_app WITH LOGIN PASSWORD 'temporary-password';
GRANT CONNECT ON DATABASE conartist TO conartist_app;
GRANT USAGE ON SCHEMA public TO conartist_app;

\c conartist;
SET ROLE conartist_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO conartist_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO conartist_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE ON SEQUENCES TO conartist_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO conartist_app;

CREATE TABLE Users (
  user_id     SERIAL PRIMARY KEY,
  email       VARCHAR(512) UNIQUE NOT NULL,
  name        VARCHAR(512) NOT NULL,
  password    VARCHAR(512) NOT NULL,
  keys        INT NOT NULL DEFAULT 1,
  join_date   TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP),
  CONSTRAINT user_nonempty_email CHECK (char_length(email) > 0),
  CONSTRAINT user_nonempty_name CHECK (char_length(name) > 0)
);
CREATE INDEX index_Users ON Users (email);
COMMENT ON TABLE Users IS 'A user of the ConArtist app';
-- TODO: add column comments

CREATE TABLE Conventions (
  con_id      SERIAL PRIMARY KEY,
  code        CHAR(5) UNIQUE NOT NULL,
  title       VARCHAR(512) NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL
);
CREATE INDEX index_Conventions on Conventions (code);
COMMENT ON TABLE Conventions IS 'The many conventions that are taking place around the world';

CREATE TABLE User_Conventions (
  user_con_id SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES Users       (user_id) ON DELETE CASCADE,
  con_id      INT NOT NULL REFERENCES Conventions (con_id)  ON DELETE CASCADE,
  CONSTRAINT unique_user_convention UNIQUE (user_id, con_id)
);
CREATE INDEX index_User_Conventions ON User_Conventions (user_id);
COMMENT ON TABLE User_Conventions IS 'Links users to conventions, indicating that they plan to be selling there';

CREATE TABLE ProductTypes (
  type_id       SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES Users (user_id) ON DELETE CASCADE,
  name          VARCHAR(512) NOT NULL,
  color         INT,
  discontinued  BOOLEAN NOT NULL DEFAULT (FALSE),
  CONSTRAINT unique_type_per_person UNIQUE (user_id, name)
);
CREATE INDEX index_ProductTypes ON ProductTypes (user_id);
COMMENT ON TABLE ProductTypes IS 'The types of products that a user produces';

CREATE TABLE Products (
  product_id    SERIAL PRIMARY KEY,
  type_id       INT NOT NULL REFERENCES ProductTypes  (type_id)   ON DELETE CASCADE,
  user_id       INT NOT NULL REFERENCES Users         (user_id)   ON DELETE CASCADE,
  name          VARCHAR(512) NOT NULL,
  discontinued  BOOLEAN NOT NULL DEFAULT (FALSE),
  CONSTRAINT unique_product_per_person UNIQUE (user_id, type_id, name),
  CONSTRAINT product_nonempty_name CHECK (char_length(name) > 0)
);
CREATE INDEX index_Products ON Products (user_id, type_id);
COMMENT ON TABLE Products IS 'The specific products that a user produces';

-- TODO: would this be better as user-inventory and con-inventory?
-- TODO: figure out how inventory changes will actually be tracked
CREATE TABLE Inventory (
  inv_id      SERIAL PRIMARY KEY,
  user_id     INT          REFERENCES Users             (user_id)     ON DELETE CASCADE,
  user_con_id INT          REFERENCES User_Conventions  (user_con_id) ON DELETE CASCADE,
  product_id  INT NOT NULL REFERENCES Products          (product_id)  ON DELETE CASCADE,
  quantity    INT NOT NULL,
  CONSTRAINT user_or_con CHECK (
    (user_id IS NOT NULL AND user_con_id IS NULL) OR
    (user_id IS NULL AND user_con_id IS NOT NULL)
  ),
  CONSTRAINT unique_inventory UNIQUE (product_id, user_con_id),
  CONSTRAINT inventory_positive_quantity CHECK (quantity >= 0)
);
CREATE INDEX index_Inventory_con ON Inventory (user_con_id);
CREATE INDEX index_Inventory_user ON Inventory (user_id);
COMMENT ON TABLE Inventory IS 'Keeps track of how many of each item a user has, or how many were in existence during a specific convention';

-- TODO: would this be better as user-prices and con-prices?
-- TODO: history of price changes? or something at least to allow changing prices
--       during a convention instead?
-- TODO: THE NOMS DATABASE?!?!
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

-- VARCHAR(23) is used to represent money, 23 being the longest possible length
-- e.g. CAD-9223372036854775808 to CAD9223372036854775807
CREATE TABLE Records (
  record_id   SERIAL PRIMARY KEY,
  user_con_id INT NOT NULL REFERENCES User_Conventions (user_con_id) ON DELETE CASCADE,
  price       VARCHAR(23) NOT NULL,
  products    INT[] NOT NULL,
  sale_time   TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP)
);
CREATE INDEX index_Records ON Records (user_con_id);
COMMENT ON TABLE Records IS 'Represents a sale of one or more products to one customer';

CREATE TABLE Expenses (
  expense_id  SERIAL PRIMARY KEY,
  user_con_id INT NOT NULL REFERENCES User_Conventions (user_con_id) ON DELETE CASCADE,
  price       VARCHAR(23) NOT NULL,
  category    VARCHAR(32),
  description VARCHAR(512),
  spend_time  TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP)
);
CREATE INDEX index_Expenses ON Expenses (user_con_id);
COMMENT ON TABLE Records IS 'Represents something that was purchased by a user to facilitate their attendence at a convention';
