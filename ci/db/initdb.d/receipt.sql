CREATE TABLE `receipt` (
  `id` INT NOT NULL AUTO_INCREMENT,
    `sellerID` INT NOT NULL,
    `productID` INT NOT NULL,
    `tokenID` BIGINT NOT NULL,
    `tokenURI` VARCHAR(256) NOT NULL,
    `contractAddr` VARCHAR(256) NOT NULL,
    `fromAddr` VARCHAR(256) NOT NULL,
    `toAddr` VARCHAR(256) NOT NULL,
    `registeredDate` DATETIME NOT NULL,
    `lastUpdatedDate` DATETIME NOT NULL,
    `isDeleted` INT NOT NULL,
    PRIMARY KEY (`id`)
);
