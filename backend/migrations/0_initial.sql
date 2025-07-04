CREATE TABLE `users` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `nickname` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `max_invites` INT NOT NULL DEFAULT(3),
    `created_at` TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

CREATE TABLE `invites` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `created_by` BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    `code` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

CREATE TABLE `invite_uses` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `invite_id` BIGINT NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
    `used_by` BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    `used_at` TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

CREATE VIEW `invited_users` AS
    SELECT users.id, users.nickname, users.password_hash, users.created_at FROM users
    JOIN invite_uses ON users.id = invite_uses.used_by;


