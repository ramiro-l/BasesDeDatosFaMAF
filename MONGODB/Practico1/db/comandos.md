# Mflix

```sh
tar xzvf mflix.tar.gz
mongorestore --host <host> --drop --gzip --db mflix mflix/
```

# Restaurantdb

```sh
tar xzvf restaurantdb.tar.gz
mongoimport --host <host> --db restaurantdb --collection restaurants --drop --file restaurantdb/restaurants.json
```
