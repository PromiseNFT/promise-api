CREATE TABLE `tx` (
  `id` BIGINT NOT NULL,
  `tx_dttm` DATETIME NOT NULL, 
  `tx_hash` VARCHAR(256) NOT NULL,
  `tx_id` VARCHAR(256) NOT NULL,
  `image_path` VARCHAR(256) DEFAULT NULL,
  `token_id` VARCHAR(256) NOT NULL,
  `meta_data` VARCHAR(2048) NOT NULL, 
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id`) REFERENCES `contract` (`id`)
);
