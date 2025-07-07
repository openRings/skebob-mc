CREATE TABLE sessions (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `access_token_hash` VARCHAR(255) NOT NULL,
    `refresh_token_hash` VARCHAR(255) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    `access_duration` INT UNSIGNED NOT NULL,
    `refresh_duration` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

CREATE VIEW active_sessions AS
    SELECT * FROM sessions WHERE DATE_ADD(created_at, INTERVAL access_duration SECOND) > NOW();

CREATE VIEW avaliable_sessions AS
    SELECT * FROM sessions WHERE DATE_ADD(created_at, INTERVAL refresh_duration SECOND) > NOW();

