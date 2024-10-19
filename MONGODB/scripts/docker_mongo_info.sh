#!/bin/sh

# Incluir el archivo de configuración
. ./docker_config.sh

# Comprobar si el contenedor MongoDB está en ejecución
if [ $(docker ps -q -f name="$MONGO_CONTAINER_NAME") ]; then
    echo "El contenedor '$MONGO_CONTAINER_NAME' está en ejecución."
    echo ""
    # Imprimir la URL de conexión
    IP_ADDRESS=$(docker inspect -f "{{ .NetworkSettings.IPAddress }}" "$MONGO_CONTAINER_NAME")
    echo "La IP del contenedor $MONGO_CONTAINER_NAME es:"
    echo "mongodb://$IP_ADDRESS:27017"
    echo ""
    echo "Chequear el puerto:"
    docker ps
    echo ""
    echo "Listando las bases de datos..."
    docker exec -it "$MONGO_CONTAINER_NAME" mongo --quiet --eval "db.adminCommand('listDatabases').databases.forEach(db => print(db.name))"
else
    echo "El contenedor '$MONGO_CONTAINER_NAME' no está en ejecución."
fi
