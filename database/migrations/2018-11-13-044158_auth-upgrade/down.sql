DROP TABLE EmailVerifications;
DROP TABLE PasswordResets;
DROP TABLE SignInAttempts;
ALTER TABLE Users ALTER COLUMN email SET NOT NULL;
