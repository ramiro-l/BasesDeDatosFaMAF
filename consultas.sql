USE `world`;

CREATE TABLE `country` (
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
	`GovernmentForm`  VARCHAR(200),
	`HeadOfState` VARCHAR(200),
	`Capital` INT,
	`Code2` VARCHAR(10)
);

CREATE TABLE `city` (
	`ID` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`Name` VARCHAR(200),
	`CountryCode` VARCHAR(10),
	`District` VARCHAR(200),
	`Population` INT,
	FOREIGN KEY (`CountryCode`) REFERENCES country(`Code`)
);

CREATE TABLE `countrylanguage` (
	`CountryCode` VARCHAR(10) NOT NULL,
	`Language` VARCHAR(200) NOT NULL,
	`IsOfficial` VARCHAR(200),
	`Percentage` DOUBLE,
	PRIMARY KEY (`CountryCode`, Language),
	FOREIGN KEY (`CountryCode`) REFERENCES country(`Code`)
);

CREATE TABLE `continent` (
	`Name` VARCHAR(200) PRIMARY KEY NOT NULL,
	`Area` INT,
	`PercentTotalMass` DOUBLE,
	`MostPopulousCity` VARCHAR(200)
);


-- PRACTICO 3

-- 1.1
SELECT city.Name, country.Name, country.Region, country.GovernmentForm FROM city
JOIN country ON city.CountryCode = country.Code 
ORDER BY city.Population DESC LIMIT 10;

-- 1.2
SELECT country.Name, city.Name, country.Population FROM country
LEFT JOIN city ON city.ID = country.Capital
ORDER BY country.Population ASC LIMIT 10;

-- 1.3
SELECT country.Name, country.Continent, countrylanguage.Language FROM country
JOIN countrylanguage ON country.Code = countrylanguage.CountryCode;

-- 1.4
SELECT country.Name, city.Name,FROM country
LEFT JOIN city ON city.ID = country.Capital
ORDER BY country.SurfaceArea DESC LIMIT 20;

-- 1.5
SELECT city.Name, countrylanguage.Language, countrylanguage.Percentage FROM city
JOIN countrylanguage ON (city.CountryCode = countrylanguage.CountryCode AND countrylanguage.IsOfficial = 'T')
ORDER BY city.Population DESC;

-- 1.6
(SELECT Name, Population FROM country
WHERE Population >= 100
ORDER BY country.Population DESC LIMIT 10)
UNION
(SELECT Name, Population FROM country
WHERE Population >= 100
ORDER BY country.Population ASC LIMIT 10)

-- 1.7
SELECT DISTINCT country.Name FROM country
JOIN countrylanguage ON 
country.Code = countrylanguage.CountryCode AND
countrylanguage.IsOfficial = 'T' AND
(countrylanguage.Language = "English" OR 
countrylanguage.Language = "France" );

-- 1.8 
(SELECT DISTINCT country.Name FROM country
JOIN countrylanguage ON 
country.Code = countrylanguage.CountryCode AND
countrylanguage.Language = "English")
EXCEPT
(SELECT DISTINCT country.Name FROM country
JOIN countrylanguage ON 
country.Code = countrylanguage.CountryCode AND
countrylanguage.Language = "Spanish");


-- PARTE 2

-- 1
-- Si son iguales los resultados.

-- 2
SELECT city.Name, country.Name
FROM city
LEFT JOIN country ON city.CountryCode = country.Code AND country.Name = 'Argentina';

-- Aca nos deja los nulls por el left.

SELECT city.Name, country.Name
FROM city
LEFT JOIN country ON city.CountryCode = country.Code
WHERE country.Name = 'Argentina';


-- Aca nos borra los nulls porque el where se ejecuta despues.