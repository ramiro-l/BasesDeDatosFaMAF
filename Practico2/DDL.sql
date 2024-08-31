-- PRACTICO 1
-- 1)
CREATE DATABASE `world`;

-- Borrar base de datos
DROP DATABASE world;
-- 2)
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

-- -- LIMPIAR LAS TABLAS SIN BORRARLAS
-- TRUNCATE TABLE countrylanguage;
-- TRUNCATE TABLE city;
-- TRUNCATE TABLE country;
-- -- BORRAR LAS TABLAS
-- DROP TABLE countrylanguage;
-- DROP TABLE city;
-- DROP TABLE country;
-- 3) En el archivo word-data.sql
-- 4)
CREATE TABLE
	`continent` (
		`Name` VARCHAR(200) PRIMARY KEY NOT NULL,
		`Area` INT,
		`PercentTotalMass` DOUBLE,
		`MostPopulousCity` VARCHAR(200)
	);

-- 5)
INSERT INTO
	`continent` (
		`Name`,
		`Area`,
		`PercentTotalMass`,
		`MostPopulousCity`
	)
VALUES
	('Africa', 30370000, 20.4, 'Cairo, Egypt'),
	('Antarctica', 14000000, 9.2, 'McMurdo Station*'),
	('Asia', 44579000, 29.5, 'Mumbai, India'),
	('Europe', 10180000, 6.8, 'Instanbul, Turquia'),
	(
		'North America',
		24709000,
		16.5,
		'Ciudad de México, Mexico'
	),
	('Oceania', 8600000, 5.9, 'Sydney, Australia'),
	(
		'South America',
		17840000,
		12.0,
		'São Paulo, Brazil'
	);

-- Otra opcion es:
-- INSERT INTO `continent` VALUES ('Africa', 30370000, 20.4, 'Cairo, Egypt');
-- INSERT INTO `continent` VALUES ('Antarctica', 14000000, 9.2, 'McMurdo Station*');
-- INSERT INTO `continent` VALUES ('Asia', 44579000, 29.5, 'Mumbai, India');
-- INSERT INTO `continent` VALUES ('Europe', 10180000, 6.8, 'Instanbul, Turquia');
-- INSERT INTO `continent` VALUES ('North America', 24709000, 16.5, 'Ciudad de México, Mexico');
-- INSERT INTO `continent` VALUES ('Oceania', 8600000, 5.9, 'Sydney, Australia');
-- INSERT INTO `continent` VALUES ('South America', 17840000, 12.0, 'São Paulo, Brazil');
-- 6)
ALTER TABLE `country` ADD FOREIGN KEY (`Continent`) REFERENCES continent (`Name`);