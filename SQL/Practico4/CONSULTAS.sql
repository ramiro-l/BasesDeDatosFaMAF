-- PRACTICO 4
USE `world`;

-- 1
SELECT
    city.Name,
    country.Name
FROM
    city
    JOIN country ON country.Code = city.CountryCode
WHERE
    CountryCode IN (
        SELECT
            Code
        FROM
            country AS c
        WHERE
            c.Population > 10000
    );

-- 2
SELECT
    *
FROM
    city
WHERE
    Population > (
        SELECT
            avg(Population)
        FROM
            city
    );

-- 3
SELECT
    *
FROM
    country
WHERE
    (Continent != "Asia")
    AND (
        Population >= (
            SELECT
                min(Population)
            FROM
                country
            WHERE
                Continent = "Asia"
        )
    );

-- 4
SELECT
    country.Name,
    clang.Language
FROM
    country
    JOIN countrylanguage AS clang ON country.Code = clang.CountryCode
WHERE
    clang.IsOfficial != "T"
    AND clang.Percentage > ALL (
        SELECT
            Percentage
        FROM
            countrylanguage
        WHERE
            countrylanguage.IsOfficial = "T"
            AND country.Code = countrylanguage.CountryCode
    );

-- 5
-- CON SUBQUERY
SELECT DISTINCT
    Region
FROM
    country
WHERE
    country.SurfaceArea < 1000
    AND EXISTS (
        SELECT
            *
        FROM
            city
        WHERE
            city.CountryCode = country.Code
            AND city.Population > 100000
    );

-- SIN SUBQUERY
SELECT DISTINCT
    Region
FROM
    country
    JOIN city ON city.CountryCode = country.Code
WHERE
    country.SurfaceArea < 1000
    AND city.Population > 100000;

-- 6
-- CON CONSULTAS ESCALARES
SELECT
    Name,
    (
        SELECT DISTINCT
            Population
        FROM
            city
        WHERE
            city.CountryCode = country.Code
            AND city.Population >= ALL (
                SELECT
                    Population
                FROM
                    city
                WHERE
                    city.CountryCode = country.Code
            )
    ) AS country_more_population
FROM
    country;

-- CON CONSULTAS DE AGRUPACION
SELECT
    country.Name,
    max(city.Population) AS country_more_population
FROM
    country
    LEFT JOIN city ON country.Code = city.CountryCode
GROUP BY
    country.Code;

-- 7
-- CON CONSULTAS ESCALARES
SELECT
    c.Name,
    cl.Language
FROM
    country AS c
    JOIN countrylanguage AS cl ON cl.CountryCode = c.Code
WHERE
    cl.IsOfficial = "F"
    AND cl.Percentage > ALL (
        SELECT
            avg(Percentage)
        FROM
            countrylanguage AS cl2
        WHERE
            cl2.IsOfficial = "T"
            AND cl2.CountryCode = c.Code
    );

-- 8
-- SIN GROUP BY
SELECT DISTINCT
    c.Continent,
    (
        SELECT
            sum(Population)
        FROM
            country AS c2
        WHERE
            c.continent = c2.continent
    ) AS Population
FROM
    country AS c
ORDER BY
    Population ASC;

-- CON GROUP BY
SELECT DISTINCT
    Continent,
    sum(Population) AS Population
FROM
    country
GROUP BY
    Continent
ORDER BY
    Population ASC;

-- 9
SELECT
    Continent,
    avg(LifeExpectancy) AS LifeExpectancy
FROM
    country
WHERE
    LifeExpectancy >= 40
    AND LifeExpectancy <= 70
GROUP BY
    Continent;

-- 10 Listar la cantidad máxima, mínima, promedio y suma de habitantes por continente.
SELECT
    Continent,
    max(Population) AS max_population,
    min(Population) AS min_population,
    avg(Population) AS avg_population,
    sum(Population) AS sum_population
FROM
    country
GROUP BY
    Continent;

-- 2)
-- 2.1 
-- Con agrupacion ????????????
-- Con subquery escalar, si se puede pero hay que tener cuidadod de agregar LIMIT 1 para prevenir el
-- caso en el que existan dos ciudades distintas con el mismo maximo 
SELECT
    Name,
    (
        SELECT DISTINCT
            Population
        FROM
            city
        WHERE
            city.CountryCode = country.Code
            AND city.Population >= ALL (
                SELECT
                    Population
                FROM
                    city
                WHERE
                    city.CountryCode = country.Code
            )
    ) AS country_more_population,
    (
        SELECT DISTINCT
            Name
        FROM
            city
        WHERE
            city.CountryCode = country.Code
            AND city.Population >= ALL (
                SELECT
                    Population
                FROM
                    city
                WHERE
                    city.CountryCode = country.Code
            )
    ) AS country_more_population_name
FROM
    country;