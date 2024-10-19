#!/bin/sh

. ./docker_config.sh

# Nombre del contenedor por defecto
CONTAINER_NAME=${1:-$MONGO_CONTAINER_NAME} # Usa la configuración por defecto

# Comprobar si el contenedor existe
if [ ! $(docker ps -q -f name="$CONTAINER_NAME") ]; then
    echo "El contenedor '$CONTAINER_NAME' no está en ejecución."
    exit 1
fi

# Acceder al contenedor
echo "Entrando al contenedor '$CONTAINER_NAME'..."
docker exec -it "$CONTAINER_NAME" /bin/bash

if [ $? -eq 0 ]; then
    echo "Saliste del contenedor '$CONTAINER_NAME'."
else
    echo "Error al intentar acceder al contenedor."
fi
