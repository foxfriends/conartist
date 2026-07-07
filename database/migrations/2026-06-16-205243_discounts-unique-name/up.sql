CREATE UNIQUE INDEX discounts_name_user_id_active_key ON discounts (name, user_id, deleted_at) NULLS NOT DISTINCT;
