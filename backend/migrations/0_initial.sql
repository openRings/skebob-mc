CREATE TABLE `users` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `nickname` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `max_invites` SMALLINT UNSIGNED NOT NULL DEFAULT(3),
    `created_at` TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

CREATE TABLE `invites` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `created_by` BIGINT UNSIGNED NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    `code` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

CREATE TABLE `invite_uses` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `invite_id` BIGINT UNSIGNED NOT NULL REFERENCES invites(id) ON DELETE CASCADE,
    `used_by` BIGINT UNSIGNED NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    `used_at` TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP)
);

CREATE VIEW `invited_users` AS
    SELECT u.id, u.nickname, u.password_hash, u.created_at FROM users u
    JOIN invite_uses iu ON u.id = iu.used_by;

CREATE VIEW `avaliable_invites` AS
    SELECT i.id, i.created_by, i.code, i.created_at FROM invites i
    LEFT JOIN invite_uses AS iu ON i.id = iu.invite_id
    WHERE iu.id IS NULL;

CREATE VIEW user_invites_remained AS
    SELECT u.id, u.nickname, (u.max_invites - IFNULL(i.invites_count, 0)) AS remained , iu.id IS NOT NULL AS can_invite FROM users u
    LEFT JOIN invite_uses as iu ON u.id = iu.used_by
    LEFT JOIN (
        SELECT created_by, COUNT(*) AS invites_count FROM invites 
        GROUP BY created_by
    ) i
        ON u.id = i.created_by;
