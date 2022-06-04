ALTER TABLE ProductTypes ADD COLUMN discontinued BOOLEAN NOT NULL DEFAULT false;

UPDATE ProductTypes p
    SET discontinued = rs.discontinued 
    FROM (
        SELECT l.type_id, l.event_type = 'disabled'::event_type as discontinued
        FROM ProductTypeEvents l
        LEFT OUTER JOIN ProductTypeEvents r
        ON l.event_id = r.event_id AND l.event_time > r.event_time
        WHERE r.event_id is null
    ) rs
    WHERE p.type_id = rs.type_id;

DROP TABLE ProductTypeEvents;
