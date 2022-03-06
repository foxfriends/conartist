ALTER TABLE WebhookNewRecord ADD CONSTRAINT WebhookNewRecord_unique_url UNIQUE (user_id, url);
ALTER TABLE WebhookDeletedRecord ADD CONSTRAINT WebhookDeletedRecord_unique_url UNIQUE (user_id, url);
