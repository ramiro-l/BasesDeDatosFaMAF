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
CREATE PROCEDURE updateCredit(
    in customer_number int(11),
    in new_limit decimal(10, 2)
)
UPDATE
    customers AS c
SET
    c.creditLimit = new_limit
WHERE
    c.customerNumber = customer_number;

-- TODO: PORBARLO.
/*
 5. Cree una vista "Premium Customers" que devuelva el top 10 de clientes que más dinero han gastado en la plataforma. La vista deberá devolver el nombre del cliente, la ciudad y el total gastado por ese cliente en la plataforma.
 */
/*
 6. Cree una función "employee of the month" que tome un mes y un año y devuelve el empleado (nombre y apellido) cuyos clientes hayan efectuado la mayor cantidad de órdenes en ese mes.
 */
/*
 7. Crear una nueva tabla "Product Refillment". Deberá tener una relación varios a uno con "products" y los campos: `refillmentID`, `productCode`, `orderDate`, `quantity`.
 */
/*
 8. Definir un trigger "Restock Product" que esté pendiente de los cambios efectuados en `orderdetails` y cada vez que se agregue una nueva orden revise la cantidad de productos pedidos (`quantityOrdered`) y compare con la cantidad en stock (`quantityInStock`) y si es menor a 10 genere un pedido en la tabla "Product Refillment" por 10 nuevos productos.
 */
/*
 9. Crear un rol "Empleado" en la BD que establezca accesos de lectura a todas las tablas y accesos de creación de vistas.
 */
-- Consultas Adicionales
/*
 1. Encontrar, para cada cliente de aquellas ciudades que comienzan por 'N', la menor y la mayor diferencia en días entre las fechas de sus pagos. No mostrar el id del cliente, sino su nombre y el de su contacto.
 */
/*
 2. Encontrar el nombre y la cantidad vendida total de los 10 productos más vendidos que, a su vez, representen al menos el 4% del total de productos, contando unidad por unidad, de todas las órdenes donde intervienen. No utilizar LIMIT.
 */