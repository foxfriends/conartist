ALTER TABLE Products ADD COLUMN discontinued BOOLEAN NOT NULL DEFAULT false;

UPDATE Products p
    SET discontinued = rs.discontinued 
    FROM (
        SELECT l.product_id, l.event_type = 'disabled'::event_type as discontinued
        FROM ProductEvents l
        LEFT OUTER JOIN ProductEvents r
        ON l.event_id = r.event_id AND l.event_time > r.event_time
        WHERE r.event_id is null
    ) rs
    WHERE p.product_id = rs.product_id;

DROP TABLE ProductEvents;

DROP TYPE event_type;
