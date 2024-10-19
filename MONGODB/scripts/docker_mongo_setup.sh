#!/bin/sh

. ./docker_config.sh

CONTAINER_NAME=${2:-$MONGO_CONTAINER_NAME} # Usa la configuración por defecto

# Descargar la imagen del contenedor Mongo
echo "Descargando la imagen de MongoDB..."
docker pull mongo:5

# Iniciar un contenedor de MongoDB
echo "Iniciando el contenedor de MongoDB..."
docker run --name $CONTAINER_NAME -d mongo:5

# Chequear que el contenedor esté en ejecución
echo "Chequeando que el contenedor esté en ejecución..."
docker ps

# Listar la IP del contenedor
echo "Listando la IP del contenedor..."
IP_ADDRESS=$(docker inspect -f "{{ .NetworkSettings.IPAddress }}" $CONTAINER_NAME)
echo "La IP del contenedor $CONTAINER_NAME es:"
echo "mongodb://$IP_ADDRESS"
