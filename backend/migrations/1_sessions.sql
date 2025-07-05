CREATE TABLE sessions (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `access_token_hash` VARCHAR(255) NOT NULL,
    `refresh_token_hash` VARCHAR(255) NOT NULL,
    `user_id` BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    `duration` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

