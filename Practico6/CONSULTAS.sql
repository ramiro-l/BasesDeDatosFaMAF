USE classicmodels;

SHOW TABLES;

-- Consultas:
/*
 1. Devuelva la oficina con mayor número de empleados.
 */
SELECT
    o.*,
    count(o.officeCode) AS cant_employees
FROM
    offices AS o
    JOIN employees AS e ON o.officeCode = e.officeCode
GROUP BY
    o.officeCode
ORDER BY
    cant_employees DESC
LIMIT
    1;

/*
 2. ¿Cuál es el promedio de órdenes hechas por oficina?, ¿Qué oficina vendió la mayor cantidad de productos?
 */
--2.1
SELECT
    avg(all_office.cant_orders) AS avg_for_office
FROM
    (
        SELECT
            o.officeCode,
            o.city,
            count(o.officeCode) AS cant_orders
        FROM
            offices AS o
            JOIN employees AS e ON o.officeCode = e.officeCode
            JOIN customers AS c ON e.employeeNumber = c.salesRepEmployeeNumber
            JOIN orders ON orders.customerNumber = c.customerNumber
        GROUP BY
            o.officeCode
    ) AS all_office;

--2.2
SELECT
    o.officeCode,
    o.city,
    count(o.officeCode) AS cant_orders
FROM
    offices AS o
    JOIN employees AS e ON o.officeCode = e.officeCode
    JOIN customers AS c ON e.employeeNumber = c.salesRepEmployeeNumber
    JOIN orders ON orders.customerNumber = c.customerNumber
GROUP BY
    o.officeCode
ORDER BY
    cant_orders DESC
LIMIT
    1;

/*
 3. Devolver el valor promedio, máximo y mínimo de pagos que se hacen por mes.
 */
SELECT
    DATE_FORMAT (p.paymentDate, '%Y-%m') AS mes,
    avg(p.amount) AS promedio,
    max(p.amount) AS maximo,
    min(p.amount) AS minimo
FROM
    payments AS p
GROUP BY
    mes
ORDER BY
    mes;

/*
 4. Crear un procedimiento "Update Credit" en donde se modifique el límite de crédito de un cliente con un valor pasado por parámetro.
 */
CREATE PROCEDURE update_credit(
    in customer_number int(11),
    in new_limit decimal(10, 2)
)
UPDATE
    customers AS c
SET
    c.creditLimit = new_limit
WHERE
    c.customerNumber = customer_number;

SELECT
    c.customerNumber,
    c.creditLimit
FROM
    customers AS c
WHERE
    c.customerNumber = 103;

CALL update_credit(103, 10.00);

/*
 5. Cree una vista "Premium Customers" que devuelva el top 10 de clientes que más dinero han gastado en la plataforma. La vista deberá devolver el nombre del cliente, la ciudad y el total gastado por ese cliente en la plataforma.
 */
CREATE VIEW `PremiumCustomers` AS(
    SELECT
        c.customerName,
        c.city,
        sum(p.amount) AS total_amount
    FROM
        customers AS c
        JOIN payments AS p ON c.customerNumber = p.customerNumber
    GROUP BY
        c.customerNumber
    ORDER BY
        total_amount DESC
    LIMIT
        10
);

-- TEST:
SELECT
    *
FROM
    `PremiumCustomers`;

/*
 6. Cree una función "employee of the month" que tome un mes y un año y devuelve el empleado (nombre y apellido) cuyos clientes hayan efectuado la mayor cantidad de órdenes en ese mes.
 */
CREATE FUNCTION employee_of_the_month(mes INT, anio INT) RETURNS VARCHAR(200) READS SQL DATA BEGIN DECLARE employee_name VARCHAR(200);

SELECT
    CONCAT(e.firstName, ' ', e.lastName) INTO employee_name
FROM
    employees AS e
    JOIN customers AS c ON c.salesRepEmployeeNumber = e.employeeNumber
    JOIN orders AS o ON o.customerNumber = c.customerNumber
WHERE
    DATE_FORMAT(o.requiredDate, '%Y') = anio
    AND DATE_FORMAT(o.requiredDate, '%m') = mes
GROUP BY
    e.employeeNumber
ORDER BY
    COUNT(*) DESC
LIMIT
    1;

if employee_name is null then
SET
    employee_name = 'No hay datos';

end if;

RETURN employee_name;

END;

-- DROP FUNCTION employee_of_the_month;
-- TEST:
SELECT
    employee_of_the_month(1, 2003) AS mejor_empleado;

/*
 7. Crear una nueva tabla "Product Refillment". Deberá tener una relación varios a uno con "products" y los campos: `refillmentID`, `productCode`, `orderDate`, `quantity`.
 */
CREATE TABLE `product_refillment` (
    `refillmentID` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `productCode` varchar(15) NOT NULL,
    `orderDate` date NOT NULL,
    `quantity` INT(10) NOT NULL,
    FOREIGN KEY (`productCode`) REFERENCES products (`productCode`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*
 8. Definir un trigger "Restock Product" que esté pendiente de los cambios efectuados en `orderdetails` y cada vez que se agregue una nueva orden revise la cantidad de productos pedidos (`quantityOrdered`) y compare con la cantidad en stock (`quantityInStock`) y si es menor a 10 genere un pedido en la tabla "Product Refillment" por 10 nuevos productos.
 */
CREATE TRIGGER `restock_products`
AFTER
INSERT
    ON `orderdetails` FOR EACH ROW BEGIN DECLARE currentStock INT;

SELECT
    p.quantityInStock INTO currentStock
FROM
    `products` AS p
WHERE
    p.productCode = NEW.productCode;

IF (currentStock - NEW.quantityOrdered) < 10 THEN
INSERT INTO
    `product_refillment` (`productCode`, `orderDate`, `quantity`)
VALUES
    (NEW.productCode, CURDATE(), 10);

END IF;

END;

-- DROP trigger `restock_products`;
-- TEST:
-- Paso 1: verificamos que tiene product_refillment
SELECT
    *
FROM
    `product_refillment`;

-- Paso 2: Obtenemos un prodcuto, copiamos su codigo y cantidad en stock
SELECT
    productCode,
    quantityInStock
FROM
    `products`
ORDER BY
    quantityInStock;

-- Paso 3: Insertamos una orden con cantidad menor para que se genere un pedido de 10 productos
INSERT INTO
    `orderdetails`(
        `orderNumber`,
        `productCode`,
        `quantityOrdered`,
        `priceEach`,
        `orderLineNumber`
    )
VALUES
    (10101, 'S24_2000', 10, 136.00, 3);

-- Paso 4: verificamos que tiene product_refillment
SELECT
    *
FROM
    `product_refillment`;

/*
 9. Crear un rol "Empleado" en la BD que establezca accesos de lectura a todas las tablas y accesos de creación de vistas.
 */
CREATE ROLE `Empleado`;

GRANT
SELECT
    ON classicmodels.* TO `Empleado`;

GRANT CREATE VIEW ON classicmodels.* TO `Empleado`;

-- TEST:
SHOW GRANTS FOR `Empleado`;

-- Consultas Adicionales
/*
 1. Encontrar, para cada cliente de aquellas ciudades que comienzan por ' N ', la menor y la mayor diferencia en días entre las fechas de sus pagos. No mostrar el id del cliente, sino su nombre y el de su contacto.
 */
/*
 2. Encontrar el nombre y la cantidad vendida total de los 10 productos más vendidos que, a su vez, representen al menos el 4% del total de productos, contando unidad por unidad, de todas las órdenes donde intervienen. No utilizar LIMIT.
 */