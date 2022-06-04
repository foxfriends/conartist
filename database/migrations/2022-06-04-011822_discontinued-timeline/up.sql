CREATE TYPE event_type AS ENUM (
    'enabled',
    'disabled'
);

CREATE TABLE ProductEvents (
    event_id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES Products (product_id) ON DELETE CASCADE,
    event_type event_type NOT NULL,
    event_time TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX product_events_ordered ON ProductEvents (event_time, product_id, event_type);

INSERT INTO ProductEvents (product_id, event_type, event_time)
    SELECT p.product_id, 'disabled'::event_type, coalesce(sale_time + '1 day', now())
    FROM Products p
    LEFT OUTER JOIN LATERAL (
        SELECT unnest(products) AS product_id, max(sale_time::timestamptz) AS sale_time
            FROM Records
            GROUP BY product_id
    ) rs ON p.product_id = rs.product_id
    WHERE discontinued = true;

ALTER TABLE Products DROP COLUMN discontinued;
