#!/bin/sh

. ./docker_config.sh

# Comprobar si se han proporcionado dos argumentos
if [ "$#" -ne 1 ]; then
    echo "Uso: $0 ruta_local"
    exit 1
fi

LOCAL_PATH=$1
CONTAINER_NAME=${2:-$MONGO_CONTAINER_NAME} # Usa la configuración por defecto

# Comprobar si el contenedor existe
if [ ! $(docker ps -a -q -f name="$CONTAINER_NAME") ]; then
    echo "El contenedor '$CONTAINER_NAME' no existe."
    exit 1
fi

# Copiar archivos al contenedor
echo "Cargando archivos desde '$LOCAL_PATH' al contenedor '$CONTAINER_NAME'..."
docker cp "$LOCAL_PATH" "$CONTAINER_NAME:/home"

if [ $? -eq 0 ]; then
    echo "Archivos cargados exitosamente al contenedor '$CONTAINER_NAME'."
else
    echo "Error al cargar archivos al contenedor."
fi
