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
  user_id   SERIAL PRIMARY KEY,
  email     VARCHAR(512) UNIQUE NOT NULL,
  password  VARCHAR(512) NOT NULL,
  keys      INT NOT NULL DEFAULT 1,
  join_date TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP)
);
CREATE INDEX index_Users ON Users (email);

CREATE TABLE Conventions (
  con_id      SERIAL PRIMARY KEY,
  code        CHAR(5) UNIQUE NOT NULL,
  title       VARCHAR(512) NOT NULL,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL
);
CREATE INDEX index_Conventions on Conventions (code);

CREATE TABLE User_Conventions (
  user_con_id SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES Users       (user_id) ON DELETE CASCADE,
  con_id      INT NOT NULL REFERENCES Conventions (con_id)  ON DELETE CASCADE
);
CREATE INDEX index_User_Conventions ON User_Conventions (user_id);

CREATE TABLE ProductTypes (
  type_id       SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES Users (user_id) ON DELETE CASCADE,
  name          VARCHAR(512) NOT NULL,
  color         INT,
  discontinued  BOOLEAN NOT NULL DEFAULT (FALSE)
);
CREATE INDEX index_ProductTypes ON ProductTypes (user_id);

CREATE TABLE Products (
  product_id    SERIAL PRIMARY KEY,
  type_id       INT NOT NULL REFERENCES ProductTypes  (type_id)   ON DELETE CASCADE,
  user_id       INT NOT NULL REFERENCES Users         (user_id)   ON DELETE CASCADE,
  name          VARCHAR(512) NOT NULL,
  discontinued  BOOLEAN NOT NULL DEFAULT (FALSE)
);
CREATE INDEX index_Products ON Products (user_id, type_id);

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
  CONSTRAINT unique_inventory UNIQUE (product_id, user_con_id)
);
CREATE INDEX index_Inventory_con ON Inventory (user_con_id);
CREATE INDEX index_Inventory_user ON Inventory (user_id);

CREATE TABLE Prices (
  price_id    SERIAL PRIMARY KEY,
  user_id     INT          REFERENCES Users             (user_id)     ON DELETE CASCADE,
  user_con_id INT          REFERENCES User_Conventions  (user_con_id) ON DELETE CASCADE,
  type_id     INT NOT NULL REFERENCES ProductTypes      (type_id)     ON DELETE CASCADE,
  product_id  INT          REFERENCES Products          (product_id)  ON DELETE CASCADE,
  prices      DECIMAL[2][] NOT NULL,
  CONSTRAINT user_or_con CHECK (
    (user_id IS NOT NULL AND user_con_id IS NULL) OR
    (user_id IS NULL AND user_con_id IS NOT NULL)
  ),
  CONSTRAINT unique_prices UNIQUE (product_id, type_id, user_con_id)
);
CREATE INDEX index_Prices_con ON Prices (user_con_id);
CREATE INDEX index_Prices_user ON Prices (user_id);

CREATE TABLE Records (
  record_id   SERIAL PRIMARY KEY,
  user_con_id INT NOT NULL REFERENCES User_Conventions (user_con_id) ON DELETE CASCADE,
  price       MONEY NOT NULL,
  products    INT[] NOT NULL,
  sale_time   TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP)
);
CREATE INDEX index_Records ON Records (user_con_id);
