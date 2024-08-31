# BasesDeDatos FaMAF

## Pasos para usar MySQL en vs-code

1. Instalar la extencion [sqltools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools).
2. Instalar la extencion [MySQLDriver](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql).
3. Seguir los pasos de la extención para configurar la conexión a la base de datos.

# Para cargar un archivo SQL en MySQL desde la terminal.

```bash
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$DATABASE_NAME" < "$SQL_FILE"
```

Ejemplo:

```bash
mysql -u root -padmin world < archivo.sql
```
