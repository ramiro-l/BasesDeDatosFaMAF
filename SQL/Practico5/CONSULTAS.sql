USE sakila;

/*
 1. Cree una tabla de `directors` con las columnas: Nombre, Apellido, Número de 
 Películas.
 */
CREATE TABLE `directors` (
    `director_id` INT PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(45) NOT NULL,
    `last_name` VARCHAR(45) NOT NULL,
    `number_of_movies` INT NOT NULL
);

/*
 2. El top 5 de actrices y actores de la tabla `actors` que tienen la mayor experiencia (i.e. 
 el mayor número de películas filmadas) son también directores de las películas en 
 las que participaron. Basados en esta información, inserten, utilizando una subquery 
 los valores correspondientes en la tabla `directors`.
 */
INSERT INTO
    `directors`
SELECT
    a.actor_id AS director_id,
    a.first_name,
    a.last_name,
    count(fa.actor_id) AS number_of_movies
FROM
    actor AS a
    JOIN film_actor AS fa ON fa.actor_id = a.actor_id
GROUP BY
    fa.actor_id
ORDER BY
    number_of_movies DESC
LIMIT
    5;

/*
 3. Agregue una columna `premium_customer` que tendrá un valor 'T' o 'F' de acuerdo a 
 si el cliente es "premium" o no. Por defecto ningún cliente será premium.
 */
ALTER TABLE
    `customer`
ADD
    COLUMN `premium_customer` VARCHAR(5) NOT NULL DEFAULT 'F';

/*
 4. Modifique la tabla customer. Marque con 'T' en la columna `premium_customer` de 
 los 10 clientes con mayor dinero gastado en la plataforma.
 */
CREATE VIEW ten_customers_with_most_money_spent AS (
    SELECT
        c.customer_id
    FROM
        customer AS c
        JOIN payment AS p ON c.customer_id = p.customer_id
    GROUP BY
        c.customer_id
    ORDER BY
        sum(p.amount) DESC
    LIMIT
        10
);

UPDATE
    `customer`
SET
    `premium_customer` = 'T'
WHERE
    customer_id IN (
        SELECT
            customer_id
        FROM
            ten_customers_with_most_money_spent
    );

-- SELECT
--     *
-- FROM
--     customer
-- WHERE
--     customer.premium_customer = 'T';
/*
 5. Listar, ordenados por cantidad de películas (de mayor a menor), los distintos ratings 
 de las películas existentes (Hint: rating se refiere en este caso a la clasificación 
 según edad: G, PG, R, etc).
 */
SELECT
    `rating`
FROM
    `film`
GROUP BY
    `rating`
ORDER BY
    count(*) DESC;

/*
 6. ¿Cuáles fueron la primera y última fecha donde hubo pagos?
 */
(
    SELECT
        `payment_date`
    FROM
        `payment`
    ORDER BY
        `payment_date` ASC
    LIMIT
        1
)
UNION
(
    SELECT
        `payment_date`
    FROM
        `payment`
    ORDER BY
        `payment_date` DESC
    LIMIT
        1
)
/*
 7. Calcule, por cada mes, el promedio de pagos (Hint: vea la manera de extraer el 
 nombre del mes de una fecha).
 */
SELECT
    MONTH (payment_date) AS month_number,
    DATE_FORMAT (payment_date, '%M') AS month_name,
    avg(payment.amount) AS avg_amount
FROM
    payment
GROUP BY
    month_number,
    month_name;

/*
 8. Listar los 10 distritos que tuvieron mayor cantidad de alquileres (con la cantidad total 
 de alquileres).
 */
SELECT
    district,
    count(r.staff_id) AS cant_rentals
FROM
    rental AS r
    JOIN (
        SELECT
            a.district,
            a.address_id,
            s.staff_id
        FROM
            address AS a
            JOIN staff AS s ON s.address_id = a.address_id
    ) AS s_d ON s_d.staff_id = r.staff_id
GROUP BY
    r.staff_id
ORDER BY
    cant_rentals DESC
LIMIT
    10;

/*
 9. Modifique la table `inventory_id` agregando una columna `stock` que sea un número 
 entero y representa la cantidad de copias de una misma película que tiene 
 determinada tienda. El número por defecto debería ser 5 copias.
 */
ALTER TABLE
    `inventory`
ADD
    COLUMN `stock` INT NOT NULL DEFAULT 5;

/*
 10. Cree un trigger `update_stock` que, cada vez que se agregue un nuevo registro a la 
 tabla rental, haga un update en la tabla `inventory` restando una copia al stock de la 
 película rentada (Hint: revisar que el rental no tiene información directa sobre la 
 tienda, sino sobre el cliente, que está asociado a una tienda en particular).
 */
-- TODO: Tenemos que verificar que no sea 0 el stock antes de restar ?????
CREATE TRIGGER update_stock
AFTER
INSERT
    ON rental FOR EACH ROW BEGIN
UPDATE
    inventory AS i
SET
    i.stock = i.stock - 1
WHERE
    i.inventory_id = NEW.inventory_id;

END;

-- TEST:
-- Step 1: Check stock before rental
SELECT
    inventory_id,
    stock
FROM
    inventory
WHERE
    inventory_id = 1;

-- Step 2: Insert rental
INSERT INTO
    rental (
        rental_date,
        inventory_id,
        customer_id,
        return_date,
        staff_id
    )
VALUES
    ('2021-01-01', 1, 1, '2021-01-02', 1);

-- Step 3: Check stock after rental
SELECT
    inventory_id,
    stock
FROM
    inventory
WHERE
    inventory_id = 1;

/*
 11. Cree una tabla `fines` que tenga dos campos: `rental_id` y `amount`. El primero es 
 una clave foránea a la tabla rental y el segundo es un valor numérico con dos 
 decimales.
 */
CREATE TABLE `fines` (
    `rental_id` INT,
    `amount` DECIMAL(5, 2),
    FOREIGN KEY (`rental_id`) REFERENCES `rental` (`rental_id`)
);

/*
 12. Cree un procedimiento `check_date_and_fine` que revise la tabla `rental` y cree un 
 registro en la tabla `fines` por cada `rental` cuya devolución (return_date) haya 
 tardado más de 3 días (comparación con rental_date). El valor de la multa será el 
 número de días de retraso multiplicado por 1.5.
 */
CREATE PROCEDURE check_date_and_fine() BEGIN
INSERT INTO
    `fines`
SELECT
    rental_id,
    ROUND(DATEDIFF(r.return_date, r.rental_date) * 1.5, 2) AS amount
FROM
    rental AS r
WHERE
    DATEDIFF(r.return_date, r.rental_date) > 3;

END;

-- DROP PROCEDURE IF EXISTS check_date_and_fine;
-- TEST:
SELECT
    *
FROM
    fines;

CALL check_date_and_fine;

/*
 13. Crear un rol `employee` que tenga acceso de inserción, eliminación y actualización a 
 la tabla `rental`.
 */
create role `employee`;

grant,
INSERT
,
UPDATE
,
    DELETE on `rental` to `employee`;

FLUSH PRIVILEGES;

/*
 14. Revocar el acceso de eliminación a `employee` y crear un rol `administrator` que 
 tenga todos los privilegios sobre la BD `sakila`.
 */
revoke
INSERT
,
UPDATE
,
    DELETE on `rental`
from
    `employee`;

CREATE ROLE 'administrator';

GRANT ALL PRIVILEGES ON sakila.* TO 'administrator';

SHOW GRANTS FOR 'administrator';

FLUSH PRIVILEGES;

/*
 15. Crear dos roles de empleado. A uno asignarle los permisos de `employee` y al otro 
 de `administrator`.
 */
CREATE USER 'empleado1' @'172.17.0.1' IDENTIFIED BY '1234';

CREATE USER 'empleado2' @'172.17.0.1' IDENTIFIED BY '1234';

GRANT 'employee' TO 'empleado1' @'172.17.0.1';

GRANT 'administrator' TO 'empleado2' @'172.17.0.1';

SHOW GRANTS FOR 'empleado1' @'172.17.0.1';

SHOW GRANTS FOR 'empleado2' @'172.17.0.1';