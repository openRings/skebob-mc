CREATE USER 'libreauth'@'172.%' IDENTIFIED BY 'libreauth';

GRANT ALL PRIVILEGES ON *.* TO 'libreauth'@'172.%';

FLUSH PRIVILEGES;
