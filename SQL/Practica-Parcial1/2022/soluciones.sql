USE `videogames`;

-- EJ 1
CREATE TABLE `reviews` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user` INT NOT NULL,
    `game` INT NOT NULL,
    `rating` DECIMAL(2, 1) NOT NULL,
    `comment` VARCHAR(250),
    CONSTRAINT reviewsPK PRIMARY KEY (`id`, `user`),
    CONSTRAINT userFK FOREIGN KEY (`user`) REFERENCES `user` (`id`),
    CONSTRAINT gameFK FOREIGN KEY (`game`) REFERENCES `game` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- EJ2
DELETE FROM
    `reviews` AS r
WHERE
    r.comment IS NULL;

ALTER TABLE
    `reviews`
MODIFY
    `comment` VARCHAR(250) NOT NULL;

-- TEST
-- SELECT
--     *
-- FROM
--     `reviews` AS r
-- WHERE
--     r.comment IS NULL;
-- DESCRIBE `reviews`; -- VER LA INFO DE LA TABLA
-- INSERT INTO `reviews` (`id`, `user`, `game`, `rating`, `comment`) VALUES (10, 5, 550, '2.8', NULL);
-- EJ3 
(
    WITH avg_for_gen AS (
        SELECT
            gen.name,
            avg(r.rating) AS average
        FROM
            `reviews` AS r
            JOIN `game_genres` AS g ON r.game = g.game
            JOIN `genre` AS gen ON g.genre = gen.id
        GROUP BY
            gen.name
    ) (
        SELECT
            *
        FROM
            avg_for_gen
        ORDER BY
            average DESC
        LIMIT
            1
    )
    UNION
    (
        SELECT
            *
        FROM
            avg_for_gen
        ORDER BY
            average ASC
        LIMIT
            1
    )
);

-- EJ4 
ALTER TABLE
    `user`
ADD
    `number_of_reviews` INT NOT NULL DEFAULT 0;

CREATE PROCEDURE set_user_number_of_reviews(in username VARCHAR(100)) BEGIN
UPDATE
    `user` AS u
SET
    u.number_of_reviews = (
        SELECT
            count(*)
        FROM
            reviews AS r
            JOIN `user` AS u2 ON r.`user` = u2.id
        WHERE
            u2.username = username
    )
WHERE
    u.username = username;

END;

-- EJ 6
CREATE TRIGGER increase_number_of_reviews
AFTER
INSERT
    ON `reviews` FOR EACH ROW BEGIN
UPDATE
    `user` AS u
SET
    u.number_of_reviews = u.number_of_reviews + 1
WHERE
    u.id = NEW.user;

END;

CREATE TRIGGER decrease_number_of_reviews
AFTER
    DELETE ON `reviews` FOR EACH ROW BEGIN
UPDATE
    `user` AS u
SET
    u.number_of_reviews = u.number_of_reviews - 1
WHERE
    u.id = OLD.user;

END;

-- TEST
-- DROP trigger `increase_number_of_reviews`;
-- SELECT
--     *
-- FROM
--     `user`;
-- INSERT INTO
--     `reviews` (`user`, `game`, `rating`, `comment`)
-- VALUES
--     (1, 550, '2.8', "ASDSA");
-- DELETE FROM
--     `reviews` AS r
-- WHERE
--     r.user = 1;
--EJ7
SELECT
    c.name,
    avg(r.rating) AS average
FROM
    (
        SELECT
            c.id,
            c.name
        FROM
            `company` AS c
            LEFT JOIN `developers` AS d ON d.developer = c.id
        GROUP BY
            c.id
        HAVING
            count(*) >= 50
    ) AS c
    JOIN `developers` AS d ON d.developer = c.id
    JOIN `reviews` AS r ON r.game = d.game
GROUP BY
    c.id
ORDER BY
    average DESC
LIMIT
    5;

-- EJ8 
CREATE ROLE `moderator`;

GRANT DELETE ON `reviews` TO `moderator`;

GRANT
UPDATE
    (`comment`) ON `reviews` TO `moderator`;

--EJ9
INSERT INTO
    `user` (`id`, `username`, `number_of_reviews`)
SELECT
    *
FROM
    (
        SELECT
            r.`user`,
            u.`username`,
            COUNT(*) AS number_of_reviews
        FROM
            reviews r
            INNER JOIN `user` u ON (u.id = r.`user`)
        GROUP BY
            u.id
    ) AS nr ON DUPLICATE KEY
UPDATE
    `user`.number_of_reviews = nr.number_of_reviews;

SELECT
    *
FROM
    `user`;