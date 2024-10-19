// ---------------------------------------------------------------------------------------
//  PARTE 1
// ---------------------------------------------------------------------------------------

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
  },
]);

// db.comments.findOne();

db.comments.insertMany([
  {
    name: "nametest6",
    email: "mailtest6@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 1.",
    date: new Date(),
  },
  {
    name: "nametest2",
    email: "mailtest2@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 2.",
    date: new Date(),
  },
  {
    name: "nametest3",
    email: "mailtest3@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 3.",
    date: new Date(),
  },
  {
    name: "nametest4",
    email: "mailtest4@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 4.",
    date: new Date(),
  },
  {
    name: "nametest5",
    email: "mailtest5@test.com",
    movie_id: {
      $oid: "573a1390f29313caabcd418c",
    },
    text: "Comentrario 5.",
    date: new Date(),
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

// ¿Cuál es el valor del rating de la película que tiene mayor rating?
// Respuesta:
//   "_id": "573a13a3f29313caabd0e77b"
//   title": "The Civil War"

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

// ¿Cuántos comentarios recibió?
// Respuesta: Recibio 34 comentarios.

// ---------------------------------------------------------------------------------------
// 4. Listar el nombre, id de la película, texto y fecha de los 3 comentarios más
//    recientes realizados por el usuario con email patricia_good@fakegmail.com.
// ---------------------------------------------------------------------------------------

// db.comments.findOne();

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

// TODO: Que seria `languages`, porque no existe (use `countries`).

// db.movies.find();

db.movies
  .find(
    {
      genres: { $all: ["Drama", "Action"] },
      countries: { $size: 1 },
      $or: [{ "imdb.rating": { $gt: 9 } }, { runtime: { $lte: 180 } }],
      released: { $type: "date" },
      "imdb.votes": { $type: "number" },
      // TODO: Si usamos el valor, mejor verificar que sea valido el campo?
      //       es decir del tipo que queremos.
    },
    {
      title: 1,
      genres: 1,
      released: 1,
      "imdb.votes": 1,
      countries: 1,
    }
  )
  .sort({ released: -1, "imdb.votes": -1 });

// ---------------------------------------------------------------------------------------
// 6. Listar el id del teatro (theaterId), estado (“location.address.state”),
//    ciudad(“location.address.city”), y coordenadas(“location.geo.coordinates”)
//    de los teatros que se encuentran en algunos de los estados "CA", "NY", "TX"
//    y el nombre de la ciudades comienza con una ‘F’. Listar ordenados por estado y ciudad.
// ---------------------------------------------------------------------------------------

// db.theaters.findOne();

db.theaters
  .find(
    {
      "location.address.state": { $in: ["CA", "NY", "TX"] },
      "location.address.city": { $regex: /^F/ },
    },
    {
      _id: 0,
      theaterId: 1,
      "location.address.state": 1,
      "location.address.city": 1,
      "location.geo.coordinates": 1,
    }
  )
  .sort({
    "location.address.state": 1,
    "location.address.city": 1,
  });

// ---------------------------------------------------------------------------------------
// 7. Actualizar los valores de los campos texto (text) y fecha (date) del comentario
//    cuyo id es ObjectId("5b72236520a3277c015b3b73") a "mi mejor comentario"
//    y fecha actual respectivamente.
// ---------------------------------------------------------------------------------------

// db.comments.findOne({ _id: ObjectId("5b72236520a3277c015b3b73") });

db.comments.updateOne(
  { _id: ObjectId("5b72236520a3277c015b3b73") },
  {
    $set: { text: "mi mejor comentario" },
    $currentDate: { date: true },
  }
);

// ---------------------------------------------------------------------------------------
// 8. Actualizar el valor de la contraseña del usuario cuyo email es
//    joel.macdonel@fakegmail.com a "some password". La misma consulta debe poder insertar
//    un nuevo usuario en caso que el usuario no exista. Ejecute la consulta dos veces.
//    ¿Qué operación se realiza en cada caso ? (Hint: usar upserts).
// ---------------------------------------------------------------------------------------

// db.users.findOne();
// db.users.findOne({ email: "joel.macdonel@fakegmail.com" }); // -> El user no existe = null

db.users.updateOne(
  { email: "joel.macdonel@fakegmail.com" },
  { $set: { password: "some password" } },
  { upsert: true } // -> ESTE CAMPO ME PERMITE INSETAR SI NO EXISTE EL DOCUMENTO.
);

// ¿Qué operación se realiza en cada caso ?
// Respuesta: La primera vez como no existia el usuario (documento), creo uno nuevo.
//            La segunda vex como si existia el usuario, simplemente actualizo la data.

// ---------------------------------------------------------------------------------------
// 9. Remover todos los comentarios realizados por el usuario cuyo email es
//    victor_patel@fakegmail.com durante el año 1980.
// ---------------------------------------------------------------------------------------

db.comments.deleteMany({
  email: "victor_patel@fakegmail.com",
  date: {
    $gte: ISODate("1980-01-01"),
    $lte: ISODate("1980-12-31"),
  },
});

// ---------------------------------------------------------------------------------------
//  PARTE 2
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 10. Listar el id del restaurante (restaurant_id) y las calificaciones de los
//     restaurantes donde al menos una de sus calificaciones haya sido realizada
//     entre 2014 y 2015 inclusive, y que tenga una puntuación(score)
//     mayor a 70 y menor o igual a 90.
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 11. Agregar dos nuevas calificaciones al restaurante cuyo id es "50018608".
//     A continuación se especifican las calificaciones a agregar en una sola consulta.
//
//     {
//     	"date" : ISODate("2019-10-10T00:00:00Z"),
//     	"grade" : "A",
//     	"score" : 18
//     }
//
//     {
//     	"date" : ISODate("2020-02-25T00:00:00Z"),
//     	"grade" : "A",
//     	"score" : 21
//     }
//
// ---------------------------------------------------------------------------------------
