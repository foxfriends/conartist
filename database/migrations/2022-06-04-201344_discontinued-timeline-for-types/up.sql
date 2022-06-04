CREATE TABLE ProductTypeEvents (
    event_id   SERIAL PRIMARY KEY,
    type_id    INT NOT NULL REFERENCES ProductTypes (type_id) ON DELETE CASCADE,
    event_type event_type NOT NULL,
    event_time TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX product_type_events_ordered ON ProductTypeEvents (event_time, type_id, event_type);

INSERT INTO ProductTypeEvents (type_id, event_type, event_time)
    SELECT t.type_id, 'disabled'::event_type,  coalesce(sale_time + '1 day', now())
    FROM ProductTypes t
    LEFT OUTER JOIN LATERAL (
        SELECT p.type_id, max(r.sale_time::timestamptz) as sale_time FROM
            (SELECT unnest(products) AS product_id, sale_time FROM Records) r
            INNER JOIN Products p ON r.product_id = p.product_id
            GROUP BY p.type_id
    ) rs ON t.type_id = rs.type_id
    WHERE discontinued = true;

ALTER TABLE ProductTypes DROP COLUMN discontinued;
