# Gestión de Contenedor MongoDB con Docker

Este repositorio contiene varios scripts para gestionar un contenedor de MongoDB utilizando Docker. Los scripts permiten descargar la imagen de MongoDB, iniciar el contenedor, acceder al contenedor, cargar archivos desde el sistema local y listar las bases de datos disponibles en MongoDB.

## Estructura del Proyecto

- `docker_config.sh`: Archivo de configuración que contiene la constante para el nombre del contenedor MongoDB.
- `docker_mongo_setup.sh`: Script para descargar y ejecutar un contenedor de MongoDB.
- `docker_mongo_info.sh`: Script para listar las bases de datos en el contenedor de MongoDB e info del contenedor.
- `docker_terminal.sh`: Script para acceder al contenedor de MongoDB y usar su terminal.
- `docker_copy.sh`: Script para copiar archivos desde la máquina local al contenedor.

## Pasos para cargar una base de datos en el contenedor

1. Usar `docker_mongo_setup.sh` para descargar y ejecutar un contenedor de MongoDB.
2. Descargarse el archivo de la base de datos a cargar en el contenedor. Ej `new_db.tar.gz`.
3. Usar `docker_copy.sh` para copiar el archivo de la base de datos al contenedor.
   1. `./docker_copy.sh new_db.tar.gz` (esto se guarda en /home)
4. Entrar al contenedor con `docker_terminal.sh`.
5. Ir al directorio donde se copió el archivo de la base de datos.
   1. `cd /home`
6. Descomprimir el archivo de la base de datos.
   1. `tar -xvzf new_db.tar.gz`
7. Restaurar la base de datos en MongoDB.
   1. ` mongorestore --host localhost --drop --gzip --db new_db new_db/`\
8. Opcional: Borrar el archivo de la base de datos.
   1. `rm -rf new_db.tar.gz new_db`
9. Salir del contenedor con `exit`.
10. Verificar que la base de datos se haya cargado correctamente con `docker_mongo_info.sh`.
