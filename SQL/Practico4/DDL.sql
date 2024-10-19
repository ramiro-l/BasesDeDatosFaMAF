-- Se usa la misma DDL del practico 2.
USE `world`;

CREATE TABLE
	`country` (
		`Code` VARCHAR(10) PRIMARY KEY NOT NULL,
		`Name` VARCHAR(200),
		`Continent` VARCHAR(200),
		`Region` VARCHAR(200),
		`SurfaceArea` DOUBLE,
		`IndepYear` INT,
		`Population` INT,
		`LifeExpectancy` INT,
		`GNP` INT,
		`GNPOld` INT,
		`LocalName` VARCHAR(200),
		`GovernmentForm` VARCHAR(200),
		`HeadOfState` VARCHAR(200),
		`Capital` INT,
		`Code2` VARCHAR(10)
	);

CREATE TABLE
	`city` (
		`ID` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
		`Name` VARCHAR(200),
		`CountryCode` VARCHAR(10),
		`District` VARCHAR(200),
		`Population` INT,
		FOREIGN KEY (`CountryCode`) REFERENCES country (`Code`)
	);

CREATE TABLE
	`countrylanguage` (
		`CountryCode` VARCHAR(10) NOT NULL,
		`Language` VARCHAR(200) NOT NULL,
		`IsOfficial` VARCHAR(200),
		`Percentage` DOUBLE,
		PRIMARY KEY (`CountryCode`, Language),
		FOREIGN KEY (`CountryCode`) REFERENCES country (`Code`)
	);

CREATE TABLE
	`continent` (
		`Name` VARCHAR(200) PRIMARY KEY NOT NULL,
		`Area` INT,
		`PercentTotalMass` DOUBLE,
		`MostPopulousCity` VARCHAR(200)
	);