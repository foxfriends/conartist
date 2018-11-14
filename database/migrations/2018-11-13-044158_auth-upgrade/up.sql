ALTER TABLE Users ALTER COLUMN email DROP NOT NULL;

CREATE TABLE SignInAttempts (
  user_id           INT NOT NULL REFERENCES Users (user_id) ON DELETE CASCADE,
  successful        BOOLEAN NOT NULL,
  attempt_time      TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP),
  PRIMARY KEY (user_id, attempt_time)
);

CREATE TABLE PasswordResets (
  verification_code CHAR(32) PRIMARY KEY,
  user_id           INT NOT NULL REFERENCES Users (user_id) ON DELETE CASCADE,
  used              BOOLEAN NOT NULL DEFAULT (false),
  created           TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP),
  expires           TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP + '12 hours'::INTERVAL)
);

CREATE TABLE EmailVerifications (
  verification_code CHAR(32) PRIMARY KEY,
  user_id           INT UNIQUE NOT NULL REFERENCES Users (user_id) ON DELETE CASCADE,
  email             VARCHAR(512) NOT NULL,
  created           TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP),
  expires           TIMESTAMP NOT NULL DEFAULT (NOW()::TIMESTAMP + '3 days'::INTERVAL)
);
