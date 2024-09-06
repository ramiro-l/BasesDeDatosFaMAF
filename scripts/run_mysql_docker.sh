
docker pull mysql:8.0
docker run -p 3306:3306 --name mysql-labs -e MYSQL_ROOT_PASSWORD=admin -d mysql:8.0

# docker ps

IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' mysql-labs)

mysql --host $IP -u root -p

# en sql
CREATE DATABASE world

mysql --host $IP -u root -p < ./script.sql