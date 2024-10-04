# Comandos Utiles SQL

## Acceder a la base de datos

```sql
mysql -h localhost -u root -p
```

> Remplazar `localhost` por la dirección del servidor, `root` por el usuario que se desea usar.

## Crear una base de datos

```sql
CREATE DATABASE new_database;
```

> Remplazar `new_database` por el nombre de la base de datos que se desea crear.

## Ver las bases de datos

```sql
SHOW DATABASES;
```

## Cargar scritp SQL

```sql
mysql -h localhost -u root -p < script.sql
```

> Remplazar `script.sql` por el nombre del archivo que se desea cargar.

## Comandos para comprimir archivos

```bash
tar -czvf soluciones.tar.gz soluciones.sql
```

## Comandos para descomprimir archivos

```bash
tar -xzvf archivo.tar.gz
```

## Recordatorios

- Las FOREIGN KEY siempre van referenciadas a una PRIMARY KEY.
- Web util: [w3schools.com](https://www.w3schools.com/sql/)
- **LEFT JOIN**: Pone todo lo de la tabla de la izq y
  lo hace coincidir con lo de la derecha
  (si no hay coincidencia, pone NULL).
- **JOIN**: Hace coincidir las filas de ambas tablas y
  muestra solo las que coinciden.
- **GROUP BY**: Si le pasa varios campos, agrupa los conjuntos que coinciden los campos.
