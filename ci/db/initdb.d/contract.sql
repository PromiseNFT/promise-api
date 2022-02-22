CREATE TABLE `contract` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_addr` VARCHAR(256) NOT NULL,
  `crt_dttm` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `account_addr` VARCHAR(256) NOT NULL,
  `account_pub_key` VARCHAR(256) NOT NULL,
  `title` VARCHAR(1024) NOT NULL,
  `ctnt` VARCHAR(2048) NOT NULL,
  `date` DATE NOT NULL,
  `time` VARCHAR(64) NOT NULL,
  `location` VARCHAR(256) NOT NULL,
  `head_count` INT NOT NULL,
  -- `attached_image_path` VARCHAR(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
