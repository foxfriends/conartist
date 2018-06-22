DROP EXTENSION "uuid-ossp";

ALTER TABLE Records DROP COLUMN gen_id;
ALTER TABLE Expenses DROP COLUMN gen_id;
