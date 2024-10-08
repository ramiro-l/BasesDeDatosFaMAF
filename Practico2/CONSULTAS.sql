USE `world`;

-- 1) Devuelva una lista de los nombres y las regiones a las que pertenece cada país ordenada alfabéticamente.
SELECT
    `Name`,
    `Region`
FROM
    `country`
ORDER BY
    `name` ASC;

-- Otra opcion es DESC
-- 2) Liste el nombre y la población de las 10 ciudades más pobladas del mundo.
SELECT
    `Name`,
    `Population`
FROM
    `city`
ORDER BY
    `Population` DESC
LIMIT
    10;

-- 3) Liste el nombre, región, superficie y forma de gobierno de los 10 países con menor superficie.
SELECT
    `Name`,
    `Region`,
    `SurfaceArea`,
    `GovernmentForm`
FROM
    `country`
ORDER BY
    `SurfaceArea` ASC
LIMIT
    10;

-- 4) Liste todos los países que no tienen independencia (hint: ver que define la independencia de un país en la BD).
SELECT
    *
FROM
    `country`
WHERE
    `IndepYear` IS NOT NULL;

-- 5) Liste el nombre y el porcentaje de hablantes que tienen todos los idiomas declarados oficiales.
SELECT
    `Language`,
    `Percentage`
FROM
    `countrylanguage`
WHERE
    `IsOfficial` = 'T';

-- ADICIONALES:
-- 6) Actualizar el valor de porcentaje del idioma inglés en el país con código 'AIA' a 100.0
UPDATE `countrylanguage`
SET
    `Percentage` = 100.0
WHERE
    `CountryCode` = 'AIA';

-- Para verificar usar esta consulta:
SELECT
    *
FROM
    `countrylanguage`
WHERE
    `CountryCode` = 'AIA';

-- 7) Listar las ciudades que pertenecen a Córdoba (District) dentro de Argentina.
SELECT
    *
FROM
    `city`
WHERE
    `District` = 'Córdoba';

-- 8) Eliminar todas las ciudades que pertenezcan a Córdoba fuera de Argentina.
DELETE FROM `city`
WHERE
    `District` = 'Córdoba'
    AND `CountryCode` != 'ARG';

-- 9) Listar los países cuyo Jefe de Estado se llame John.
SELECT
    *
FROM
    `country`
WHERE
    `HeadOfState` LIKE '%John%';

-- 10) Listar los países cuya población esté entre 35 M y 45 M ordenados por población de forma descendente.
SELECT
    *
FROM
    `country`
WHERE
    `Population` BETWEEN 35000000 AND 45000000;

-- 11) Identificar las redundancias en el esquema final.
/*  
En la tabla city tenemos que en los `District` tenemos redundancia.
En general hay muy poca redundancia en el esquema final.
 */