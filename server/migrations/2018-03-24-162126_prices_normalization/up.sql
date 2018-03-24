ALTER TABLE Prices RENAME TO Prices___Backup;

CREATE TABLE Prices (
    user_id     INT NOT NULL REFERENCES Users (user_id) ON DELETE CASCADE,
    type_id     INT NOT NULL REFERENCES ProductTypes (type_id) ON DELETE CASCADE,
    product_id  INT REFERENCES Products (product_id) ON DELETE CASCADE,
    quantity    INT NOT NULL,
    price       CHAR(23) NOT NULL,
    mod_date    TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP),
    PRIMARY KEY (user_id, type_id, product_id, quantity)
);
COMMENT ON TABLE Prices IS 'Records how much each product or product type should cost, for a user or for a specific convention';

INSERT INTO Prices
SELECT user_id,
       type_id,
       product_id,
       (json_array_elements(prices)::json->>0)::INT as quantity,
       (json_array_elements(prices)::json->>1)::CHAR(23) as price
  FROM Prices___Backup;

DROP TABLE Prices___Backup;
