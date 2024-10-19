use("mflix");

// ---------------------------------------------------------------------------------------
// 1. Insertar 5 nuevos usuarios en la colección users. Para cada nuevo usuario creado,
//    insertar al menos un comentario realizado por el usuario en la colección comments.
// ---------------------------------------------------------------------------------------

// db.users.findOne();

db.users.insertMany([
  {
    name: "nametest1",
    email: "mailtest1@test.com",
    password: "1234",
  },
  {
    name: "nametest2",
    email: "mailtest2@test.com",
    password: "1234",
  },
  {
    name: "nametest3",
    email: "mailtest3@test.com",
    password: "1234",
  },
  {
    name: "nametest4",
    email: "mailtest4@test.com",
    password: "1234",
  },
  {
    name: "nametest5",
    email: "mailtest5@test.com",
    password: "1234",
    date: new Date(),
  },
]);

// db.comments.findOne();

db.comments.insertMany([
  {
    name: "nametest1",
    email: "mailtest1@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 1.",
  },
  {
    name: "nametest2",
    email: "mailtest2@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 2.",
  },
  {
    name: "nametest3",
    email: "mailtest3@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 3.",
  },
  {
    name: "nametest4",
    email: "mailtest4@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 4.",
  },
  {
    name: "nametest5",
    email: "mailtest5@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 5.",
  },
]);

// ---------------------------------------------------------------------------------------
// 2. Listar el título, año, actores (cast), directores y rating de las 10 películas
//    con mayor rating (“imdb.rating”) de la década del 90.
//    ¿Cuál es el valor del rating de la película que tiene mayor rating?
//    (Hint: Chequear que el valor de “imdb.rating” sea de tipo “double”).
// ---------------------------------------------------------------------------------------

// db.movies.findOne();

db.movies
  .find({
    year: 1990,
    "imdb.rating": { $type: "double" },
  })
  .sort({ "imdb.rating": -1 })
  .limit(10);

/* La respuesta es: 
    "_id": "573a13a3f29313caabd0e77b"
    "title": "The Civil War"
*/

// ---------------------------------------------------------------------------------------
// 3. Listar el nombre, email, texto y fecha de los comentarios que la película
//    con id (movie_id) ObjectId("573a1399f29313caabcee886")
//    recibió entre los años 2014 y 2016 inclusive.
//    Listar ordenados por fecha.
//    Escribir una nueva consulta (modificando la anterior) para responder ¿Cuántos comentarios recibió?
// ---------------------------------------------------------------------------------------

// db.comments.findOne();

db.comments
  .find(
    {
      movie_id: ObjectId("573a1399f29313caabcee886"),
      date: {
        $gte: ISODate("2014-01-01T00:00:00Z"),
        $lte: ISODate("2016-12-31T23:59:59Z"),
      },
    },
    {
      name: 1,
      email: 1,
      text: 1,
      date: 1,
      _id: 0,
    }
  )
  .sort({ date: -1 });

db.comments.countDocuments({
  movie_id: ObjectId("573a1399f29313caabcee886"),
  date: {
    $gte: ISODate("2014-01-01T00:00:00Z"),
    $lte: ISODate("2016-12-31T23:59:59Z"),
  },
});
// Recibio 34 comentarios.

// ---------------------------------------------------------------------------------------
// 4. Listar el nombre, id de la película, texto y fecha de los 3 comentarios más
//    recientes realizados por el usuario con email patricia_good@fakegmail.com.
// ---------------------------------------------------------------------------------------

db.comments.findOne();

db.comments
  .find(
    {
      email: "patricia_good@fakegmail.com",
      date: { $type: "date" },
    },
    {
      name: 1,
      movie_id: 1,
      text: 1,
      date: 1,
      _id: 0,
    }
  )
  .sort({ date: -1 })
  .limit(3);

// ---------------------------------------------------------------------------------------
// 5. Listar el título, idiomas (languages), géneros, fecha de lanzamiento (released)
//    y número de votos (“imdb.votes”) de las películas de géneros Drama y Action
//    (la película puede tener otros géneros adicionales), que solo están disponibles
//    en un único idioma y por último tengan un rating (“imdb.rating”) mayor a 9
//    o bien tengan una duración (runtime) de al menos 180 minutos. Listar ordenados
//    por fecha de lanzamiento y número de votos.
// ---------------------------------------------------------------------------------------

db.movies.findOne();

db.movies.find(
  {
    genres: { $elemMatch: ["Drama", "Action"] },
    countries: { $size: 1 },
  },
  {
    title: 1,
    genres: 1,
    "imdb.votes": 1,
  }
);

// ---------------------------------------------------------------------------------------
// 6. Listar el id del teatro (theaterId), estado (“location.address.state”), ciudad (“location.address.city”), y coordenadas (“location.geo.coordinates”) de los teatros que se encuentran en algunos de los estados "CA", "NY", "TX" y el nombre de la ciudades comienza con una ‘F’. Listar ordenados por estado y ciudad.
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// 7. Actualizar los valores de los campos texto (text) y fecha (date) del comentario cuyo id es ObjectId("5b72236520a3277c015b3b73") a "mi mejor comentario" y fecha actual respectivamente.
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// 8. Actualizar el valor de la contraseña del usuario cuyo email es joel.macdonel@fakegmail.com a "some password". La misma consulta debe poder insertar un nuevo usuario en caso que el usuario no exista. Ejecute la consulta dos veces. ¿Qué operación se realiza en cada caso?  (Hint: usar upserts).
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// 9. Remover todos los comentarios realizados por el usuario cuyo email es victor_patel@fakegmail.com durante el año 1980.
// ---------------------------------------------------------------------------------------
