CREATE TABLE `product` (
  `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) NOT NULL,
    `image` VARCHAR(128) NOT NULL,
    `contractAddr` VARCHAR(256) DEFAULT NULL,
    `registeredDate` DATETIME NOT NULL,
    `isDeleted` INT NOT NULL,
    `symbol` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
);
