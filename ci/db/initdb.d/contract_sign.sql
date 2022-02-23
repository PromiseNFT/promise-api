CREATE TABLE `contract_sign` (
  `id` BIGINT NOT NULL,
  `account_priv_key` VARCHAR(256) NOT NULL,
  `account_addr` VARCHAR(256) NOT NULL,
  `sign_dttm` DATETIME DEFAULT NULL,
  `user_addr` VARCHAR(256) DEFAULT NULL,
  PRIMARY KEY (`id`, `account_priv_key`),
  FOREIGN KEY (`id`) REFERENCES `contract` (`id`) ON DELETE CASCADE
);
