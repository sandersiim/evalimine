CREATE USER 'evalimised_user'@'localhost' IDENTIFIED BY 'PaSsWoRd123'

CREATE DATABASE `evalimised` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES ON evalimised.* TO 'evalimised_user'@'localhost' WITH GRANT OPTION;
