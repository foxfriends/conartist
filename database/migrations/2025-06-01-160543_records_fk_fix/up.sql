ALTER TABLE expenses
DROP CONSTRAINT expenses_user_id_fkey;

ALTER TABLE records
DROP CONSTRAINT records_user_id_fkey;

ALTER TABLE expenses
ADD FOREIGN KEY (user_id, con_id) REFERENCES user_conventions (user_id, con_id)
ON DELETE CASCADE;

ALTER TABLE records
ADD FOREIGN KEY (user_id, con_id) REFERENCES user_conventions (user_id, con_id)
ON DELETE CASCADE;

ALTER TABLE records
ADD FOREIGN KEY (user_id) REFERENCES users (user_id)
ON DELETE CASCADE
