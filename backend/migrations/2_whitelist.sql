CREATE VIEW whitelist AS
    SELECT u.nickname as username FROM users u
    JOIN invite_uses iu ON u.id = iu.used_by;
    
