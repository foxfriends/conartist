CREATE TABLE WebhookNewRecord (
    webhook_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    url     VARCHAR(1024) NOT NULL
);

CREATE TABLE WebhookDeletedRecord (
    webhook_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    url     VARCHAR(1024) NOT NULL
);
