CREATE TABLE `sign` (
  `id` BIGINT NOT NULL,
  `account_addr` VARCHAR(256) NOT NULL,
  `account_pub_key` VARCHAR(256) NOT NULL,
  `sign_dttm` DATETIME DEFAULT NULL,
  `user_addr` VARCHAR(256) DEFAULT NULL,
  PRIMARY KEY (`id`, `account_addr`),
  FOREIGN KEY (`id`) REFERENCES `contract` (`id`)
);
