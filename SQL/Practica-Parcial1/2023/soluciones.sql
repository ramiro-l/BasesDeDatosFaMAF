USE `olympics`;

-- 1. Crear un campo nuevo `total_medals` en la tabla `person` que almacena la
-- cantidad de medallas ganadas por cada persona. Por defecto, con valor 0.
ALTER TABLE
    `person`
ADD
    `total_medals` INT DEFAULT 0;

-- DESCRIBE `person`;
-- 2. Actualizar la columna `total_medals` de cada persona con el recuento real de
-- medallas que ganó. Por ejemplo, para Michael Fred Phelps II, luego de la
-- actualización debería tener como valor de `total_medals` igual a 28.
INSERT INTO
    `person` (
        `id`,
        `full_name`,
        `gender`,
        `height`,
        `weight`,
        `total_medals`
    )
SELECT
    *
FROM
    (
        SELECT
            p.id,
            p.full_name,
            p.gender,
            p.height,
            p.weight,
            count(*) AS `total_medals`
        FROM
            `person` AS p
            JOIN `games_competitor` AS g ON g.person_id = p.id
            JOIN `competitor_event` AS c ON g.id = c.competitor_id
            JOIN `medal` AS m ON m.id = c.medal_id
        WHERE
            NOT (m.medal_name = "NA")
        GROUP BY
            p.id
    ) AS newp ON DUPLICATE KEY
UPDATE
    `person`.total_medals = newp.total_medals;

-- TEST 
-- SELECT
--     *
-- FROM
--     `person`;
-- 3. Devolver todos los medallistas olímpicos de Argentina, es decir, los que hayan
-- logrado alguna medalla de oro, plata, o bronce, enumerando la cantidad por tipo de
-- medalla. Por ejemplo, la query debería retornar casos como el siguiente:
-- (Juan Martín del Potro, Bronze, 1), (Juan Martín del Potro, Silver,1)
SELECT
    p.id,
    p.full_name,
    m.medal_name,
    count(*) AS `total_medals`
FROM
    `person` AS p
    JOIN `games_competitor` AS g ON g.person_id = p.id
    JOIN `competitor_event` AS c ON g.id = c.competitor_id
    JOIN `medal` AS m ON m.id = c.medal_id
WHERE
    NOT (m.medal_name = "NA")
GROUP BY
    m.medal_name,
    p.id;

-- 4. Listar el total de medallas ganadas por los deportistas argentinos en cada deporte.
WITH deportistas_argentinos AS (
    SELECT
        p.*,
        nr.region_name
    FROM
        `person` AS p
        JOIN `person_region` AS pr ON pr.person_id = p.id
        JOIN `noc_region` AS nr ON nr.id = pr.region_id
    WHERE
        nr.region_name = "Argentina"
)
SELECT
    s.sport_name,
    count(*) AS `total_medals`
FROM
    deportistas_argentinos AS d_arg
    JOIN `games_competitor` AS g ON g.person_id = d_arg.id
    JOIN `competitor_event` AS c ON g.id = c.competitor_id
    JOIN `event` AS e ON e.id = c.event_id
    JOIN `sport` AS s ON s.id = e.sport_id
    JOIN `medal` AS m ON m.id = c.medal_id
WHERE
    NOT (m.medal_name = "NA")
GROUP BY
    s.id;

-- 5. Listar el número total de medallas de oro, plata y bronce ganadas por cada país
-- (país representado en la tabla `noc_region`), agruparlas los resultados por pais.
WITH deportistas_con_pais AS (
    SELECT
        p.*,
        nr.region_name AS pais
    FROM
        `person` AS p
        JOIN `person_region` AS pr ON pr.person_id = p.id
        JOIN `noc_region` AS nr ON nr.id = pr.region_id
)
SELECT
    d.pais,
    m.medal_name,
    count(*) AS `total_medals`
FROM
    deportistas_con_pais AS d
    JOIN `games_competitor` AS g ON g.person_id = d.id
    JOIN `competitor_event` AS c ON g.id = c.competitor_id
    JOIN `event` AS e ON e.id = c.event_id
    JOIN `sport` AS s ON s.id = e.sport_id
    JOIN `medal` AS m ON m.id = c.medal_id
WHERE
    NOT (m.medal_name = "NA")
GROUP BY
    d.pais,
    m.medal_name;

-- 6. Listar el país con más y menos medallas ganadas en la historia de las olimpiadas.
CREATE VIEW total_de_medallas_por_pais AS (
    WITH deportistas_con_pais AS (
        SELECT
            p.*,
            nr.region_name AS pais
        FROM
            `person` AS p
            JOIN `person_region` AS pr ON pr.person_id = p.id
            JOIN `noc_region` AS nr ON nr.id = pr.region_id
    )
    SELECT
        d.pais,
        sum(d.total_medals) AS `total_medals`
    FROM
        deportistas_con_pais AS d
    GROUP BY
        d.pais
);

-- DROP VIEW total_de_medallas_por_pais;
(
    SELECT
        *
    FROM
        total_de_medallas_por_pais
    ORDER BY
        `total_medals` DESC
    LIMIT
        1
)
UNION
(
    SELECT
        *
    FROM
        total_de_medallas_por_pais
    ORDER BY
        `total_medals` ASC
    LIMIT
        1
);

-- 7. Crear dos triggers:
--  a. Un trigger llamado `increase_number_of_medals` que incrementará en 1 el
--     valor del campo `total_medals` de la tabla `person`.
--  b. Un trigger llamado `decrease_number_of_medals` que decrementará en 1
--     el valor del campo `totals_medals` de la tabla `person`.
-- El primer trigger se ejecutará luego de un `INSERT` en la tabla `competitor_event` y
-- deberá actualizar el valor en la tabla `person` de acuerdo al valor introducido (i.e.
-- sólo aumentará en 1 el valor de `total_medals` para la persona que ganó una
-- medalla). Análogamente, el segundo trigger se ejecutará luego de un `DELETE` en la
-- tabla `competitor_event` y sólo actualizará el valor en la persona correspondiente.
-- EJ 6
CREATE TRIGGER increase_number_of_medals
AFTER
INSERT
    ON `competitor_event` FOR EACH ROW BEGIN
UPDATE
    `person` AS p
    JOIN `games_competitor` AS gc ON p.id = gc.person_id
SET
    p.total_medals = p.total_medals + 1
WHERE
    (gc.person_id = NEW.competitor_id)
    AND (NOT NEW.medal_id = 4);

END;

CREATE TRIGGER decrease_number_of_medals
AFTER
    DELETE ON `competitor_event` FOR EACH ROW BEGIN
UPDATE
    `person` AS p
    JOIN `games_competitor` AS gc ON p.id = gc.person_id
SET
    p.total_medals = p.total_medals - 1
WHERE
    (gc.person_id = OLD.competitor_id)
    AND (NOT OLD.medal_id = 4);

END;

-- Para hacer DELETE TRIGGER ES:
-- DROP TRIGGER increase_number_of_medals;
-- TEST
-- SELECT
--     *
-- FROM
--     person
-- WHERE
--     id = 1;
-- SELECT
--     *
-- FROM
--     games_competitor
-- WHERE
--     person_id = 1;
-- SELECT
--     *
-- FROM
--     competitor_event
-- WHERE
--     competitor_id = 1;
-- INSERT INTO
--     `competitor_event` (`event_id`, `competitor_id`, `medal_id`)
-- VALUES
--     (1, 1, 3);
-- DELETE FROM
--     `competitor_event`
-- WHERE
--     (`event_id` = 1)
--     AND (`competitor_id` = 1)
--     AND (`medal_id` = 3);
-- 8. Crear un procedimiento `add_new_medalists` que tomará un `event_id`, y tres ids
-- de atletas `g_id`, `s_id`, y `b_id` donde se deberá insertar tres registros en la tabla
-- `competitor_event` asignando a `g_id` la medalla de oro, a `s_id` la medalla de
-- plata, y a `b_id` la medalla de bronce.
CREATE PROCEDURE add_new_medalists(
    in event_id INT,
    in g_id INT,
    in s_id INT,
    in b_id INT
) BEGIN
INSERT INTO
    `competitor_event` (`event_id`, `competitor_id`, `medal_id`)
VALUES
    (event_id, g_id, 1),
    (event_id, s_id, 2),
    (event_id, b_id, 3);

END;

SELECT
    *
FROM
    medal;

-- TEST:
-- SELECT
--     *
-- FROM
--     competitor_event
-- WHERE
--     event_id = 5;
-- CALL add_new_medalists(5, 2, 3, 4);
-- 9. Crear el rol `organizer` y asignarle permisos de eliminación sobre la tabla `games`
-- y permiso de actualización sobre la columna `games_name` de la tabla `games` .
CREATE ROLE `organizer`;

GRANT DELETE ON `games` TO `organizer`;

GRANT
UPDATE
    (`games_name`) ON `games` TO `organizer`;