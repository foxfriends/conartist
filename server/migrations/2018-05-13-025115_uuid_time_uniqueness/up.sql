ALTER TABLE Records DROP CONSTRAINT records_gen_id_key;
ALTER TABLE Expenses DROP CONSTRAINT expenses_gen_id_key;

ALTER TABLE Records ADD CONSTRAINT records_sale_time_gen_id_key UNIQUE (user_id, sale_time, gen_id);
ALTER TABLE Expenses ADD CONSTRAINT expenses_spend_time_gen_id_key UNIQUE (user_id, spend_time, gen_id);
