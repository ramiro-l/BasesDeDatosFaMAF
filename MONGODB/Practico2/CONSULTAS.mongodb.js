// ---------------------------------------------------------------------------------------
//  PRACTICO VIII
// ---------------------------------------------------------------------------------------

use("mflix");

// ---------------------------------------------------------------------------------------
// 1. Cantidad de cines (theaters) por estado.
// ---------------------------------------------------------------------------------------

// db.theaters.findOne();

db.theaters.aggregate([
  {
    $group: {
      _id: "$location.address.state",
      count: { $sum: 1 },
    },
  },
]);

// ---------------------------------------------------------------------------------------
// 2. Cantidad de estados con al menos dos cines (theaters) registrados.
// ---------------------------------------------------------------------------------------

db.theaters.aggregate([
  {
    $group: {
      _id: "$location.address.state",
      count: { $sum: 1 },
    },
  },
  {
    $match: {
      count: { $gte: 2 },
    },
  },
]);

// ---------------------------------------------------------------------------------------
// 3. Cantidad de películas dirigidas por "Louis Lumière". Se puede responder sin
//    pipeline de agregación, realizar ambas queries.
// ---------------------------------------------------------------------------------------

// db.movies.findOne();

db.movies
  .find({
    directors: { $elemMatch: { $regex: /Louis Lumière/i } },
  })
  .count();

db.movies.aggregate([
  {
    $match: {
      directors: { $elemMatch: { $regex: /Louis Lumière/i } },
    },
  },
  {
    $count: "total_pelis_de_louis",
  },
]);

// ---------------------------------------------------------------------------------------
// 4. Cantidad de películas estrenadas en los años 50 (desde 1950 hasta 1959).
//    Se puede responder sin pipeline de agregación, realizar ambas queries.
// ---------------------------------------------------------------------------------------

db.movies.findOne();

db.movies
  .find({
    year: {
      $gte: 1950,
      $lt: 1960,
    },
  })
  .count();

db.movies.aggregate([
  {
    $match: {
      year: {
        $gte: 1950,
        $lt: 1960,
      },
    },
  },
  {
    $count: "cant_pelis_en_50s",
  },
]);

// ---------------------------------------------------------------------------------------
// 5. Listar los 10 géneros con mayor cantidad de películas (tener en cuenta que las
//    películas pueden tener más de un género). Devolver el género y la cantidad de
//    películas. Hint: unwind puede ser de utilidad
// ---------------------------------------------------------------------------------------

// db.movies.findOne();

db.movies.aggregate([
  {
    $unwind: "$genres",
  },
  {
    $group: {
      _id: "$genres",
      count: { $sum: 1 },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $limit: 10,
  },
]);

// ---------------------------------------------------------------------------------------
// 6. Top 10 de usuarios con mayor cantidad de comentarios, mostrando Nombre, Email y
//    Cantidad de Comentarios.
// ---------------------------------------------------------------------------------------

// db.comments.findOne();

db.comments.aggregate([
  {
    $group: {
      _id: { name: "$name", email: "$email" },
      count: { $sum: 1 },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $limit: 10,
  },
]);

// ---------------------------------------------------------------------------------------
// 7. Ratings de IMDB promedio, mínimo y máximo por año de las películas estrenadas en
//    los años 80 (desde 1980 hasta 1989), ordenados de mayor a menor por promedio del año.
// ---------------------------------------------------------------------------------------

// db.movies.findOne()

db.movies.aggregate([
  {
    $match: {
      year: {
        $gte: 1980,
        $lt: 1990,
      },
      "imdb.rating": { $type: "number" },
    },
  },
  {
    $group: {
      _id: "$year",
      promedio: {
        $avg: "$imdb.rating",
      },
      minimo: {
        $min: "$imdb.rating",
      },
      maximo: {
        $max: "$imdb.rating",
      },
    },
  },
  {
    $sort: {
      promedio: -1,
    },
  },
]);

// ---------------------------------------------------------------------------------------
// 8. Título, año y cantidad de comentarios de las 10 películas con más comentarios.
// ---------------------------------------------------------------------------------------

// db.comments.findOne();

db.comments.aggregate([
  {
    $group: {
      _id: "$movie_id",
      cant_comments: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "movies",
      localField: "_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  {
    $unwind: "$movie",
  },
  {
    $project: {
      title: "$movie.title",
      year: "$movie.year",
      cant_comments: 1,
    },
  },
  {
    $sort: {
      cant_comments: -1,
    },
  },
  {
    $limit: 10,
  },
]);

// ---------------------------------------------------------------------------------------
// 9. Crear una vista con los 5 géneros con mayor cantidad de comentarios, junto con
//    la cantidad de comentarios.
// ---------------------------------------------------------------------------------------
db.createView("top5_genres_comments", "comments", [
  {
    $group: {
      _id: "$movie_id",
      cant_comments: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "movies",
      localField: "_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  {
    $unwind: "$movie",
  },
  {
    $project: {
      genres: "$movie.genres",
      cant_comments: 1,
    },
  },
  {
    $unwind: "$genres",
  },
  {
    $group: {
      _id: "$genres",
      cant_comments: { $sum: "$cant_comments" },
    },
  },
  {
    $sort: {
      cant_comments: -1,
    },
  },
  {
    $limit: 5,
  },
]);

db.top5_genres_comments.find();

// ---------------------------------------------------------------------------------------
// 10. Listar los actores (cast) que trabajaron en 2 o más películas dirigidas por
//     "Jules Bass". Devolver el nombre de estos actores junto con la lista de películas
//     (solo título y año) dirigidas por “Jules Bass” en las que trabajaron.
//          a. Hint1: addToSet
//          b. Hint2: {'name.2': {$exists: true}} permite filtrar arrays con al menos 2
//             elementos, entender por qué.
//          c. Hint3: Puede que tu solución no use Hint1 ni Hint2 e igualmente sea correcta
// ---------------------------------------------------------------------------------------

// db.movies.findOne();

db.movies.aggregate([
  {
    $match: {
      directors: { $elemMatch: { $regex: /Jules Bass/i } },
    },
  },
  {
    $unwind: "$cast",
  },
  {
    $group: {
      _id: "$cast",
      movies: {
        $addToSet: {
          // NOTE: notar que si no agregamos el id y hay 2 peliculas con el
          // mismo nombre, pero distintos directores no lo vamos a detectar porque
          // addToSet es un conjunto => si matchea el titulo y el año no lo agrega.
          _id: "$_id",

          title: "$title",
          year: "$year",
        },
      },
    },
  },
  {
    $match: {
      // NOTE: Para que exista el elemento 1 debe
      // exitstir el elemento 0 => movies.length >= 2
      "movies.1": { $exists: true },
    },
  },
  {
    $project: {
      actor_name: "$_id",
      movies: 1,
      _id: 0,
    },
  },
]);

// ---------------------------------------------------------------------------------------
// 11. Listar los usuarios que realizaron comentarios durante el mismo mes de lanzamiento
//     de la película comentada, mostrando Nombre, Email, fecha del comentario,
//     título de la película, fecha de lanzamiento.
//     HINT: usar $lookup con multiple condiciones
// ---------------------------------------------------------------------------------------

// db.users.findOne();
// db.movies.find(); // "released"
// db.comments.find(); // "date"

// FIXME: revisar, porque no use multiples $lookup
db.comments.aggregate([
  {
    $lookup: {
      from: "movies",
      localField: "movie_id",
      foreignField: "_id",
      as: "movie",
    },
  },
  {
    $unwind: "$movie",
  },
  {
    $match: {
      $expr: {
        $and: [
          { $eq: [{ $month: "$date" }, { $month: "$movie.released" }] },
          { $eq: [{ $year: "$date" }, { $year: "$movie.released" }] },
        ],
      },
    },
  },
  {
    $project: {
      user_name: "$name",
      user_email: "$email",
      comment_date: "$date",
      movie_released_date: "$movie.released",
      movie_title: "$movie.title",
      _id: 0,
    },
  },
]);
// ---------------------------------------------------------------------------------------

// Cambiar a esta base de datos para resolver los siguientes ejercicios.
use("restaurantdb");

// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 12. Listar el id y nombre de los restaurantes junto con su puntuación máxima, mínima y la
//     suma total. Se puede asumir que el restaurant_id es único.
//        a. Resolver con $group y accumulators.
//        b. Resolver con expresiones sobre arreglos (por ejemplo, $sum) pero sin $group.
//        c. Resolver como en el punto b) pero usar $reduce para calcular la puntuación total.
//        d. Resolver con find.
// ---------------------------------------------------------------------------------------

// a)
db.restaurants.aggregate([
  {
    $unwind: "$grades",
  },
  {
    $group: {
      _id: { restaurant_id: "$restaurant_id", name: "$name" },
      grade_sum: {
        $sum: "$grades.score",
      },
      grade_max: {
        $max: "$grades.score",
      },
      grade_min: {
        $min: "$grades.score",
      },
    },
  },
  {
    $project: {
      restaurant_id: "$_id.restaurant_id",
      name: "$_id.name",
      grade_sum: 1,
      grade_max: 1,
      grade_min: 1,
      _id: 0,
    },
  },
]);

// b)
db.restaurants.aggregate([
  {
    $match: {
      "grades.score": { $exists: true, $type: "number" },
    },
  },
  {
    $project: {
      restaurant_id: 1,
      name: 1,
      grade_sum: {
        $sum: "$grades.score",
      },
      grade_max: {
        $max: "$grades.score",
      },
      grade_min: {
        $min: "$grades.score",
      },
      _id: 0,
    },
  },
]);

// c)
db.restaurants.aggregate([
  {
    // NOTE: Usando reduce, no hace falta matchear si el score es un numero
    //       porque si esta el campo o no es un numero, reduce no lo va a sumar.
    //       dando como resultado el de initialValue.
    $match: {
      "grades.score": { $exists: true, $type: "number" },
    },
  },
  {
    $project: {
      restaurant_id: 1,
      name: 1,
      grade_stats: {
        $reduce: {
          input: "$grades",
          initialValue: {
            sum: 0,
            max: -Infinity,
            min: Infinity,
          },
          in: {
            sum: { $add: ["$$value.sum", "$$this.score"] },
            max: { $max: ["$$value.max", "$$this.score"] },
            min: { $min: ["$$value.min", "$$this.score"] },
          },
        },
      },
      _id: 0,
    },
  },
]);

// d)
db.restaurants.find(
  // NOTE: Usando reduce, no hace falta matchear si el score es un numero
  //       porque si esta el campo o no es un numero, reduce no lo va a sumar.
  //       dando como resultado el de initialValue.
  {},
  {
    restaurant_id: 1,
    name: 1,
    grade_stats: {
      $reduce: {
        input: "$grades",
        initialValue: {
          sum: 0,
          max: -Infinity,
          min: Infinity,
        },
        in: {
          sum: { $add: ["$$value.sum", "$$this.score"] },
          max: { $max: ["$$value.max", "$$this.score"] },
          min: { $min: ["$$value.min", "$$this.score"] },
        },
      },
    },
    _id: 0,
  }
);

// ---------------------------------------------------------------------------------------
// 13. Actualizar los datos de los restaurantes añadiendo dos campos nuevos.
//     Se debe actualizar con una sola query.
//        a. "average_score": con la puntuación promedio
//        b. "grade": con "A" si "average_score" está entre 0 y 13,
//                    con "B" si "average_score" está entre 14 y 27
//                    con "C" si "average_score" es mayor o igual a 28
//     HINT1. Se puede usar pipeline de agregación con la operación update
//     HINT2. El operador $switch o $cond pueden ser de ayuda.
// ---------------------------------------------------------------------------------------

// db.restaurants.find();

db.restaurants.updateMany({}, [
  {
    $set: {
      average_score: {
        $avg: "$grades.score",
      },
    },
  },
  {
    $set: {
      grade: {
        $switch: {
          branches: [
            { case: { $gte: ["$average_score", 28] }, then: "C" }, // Para average_score >= 28
            { case: { $gte: ["$average_score", 14] }, then: "B" }, // Para 14 <= average_score < 28
            { case: { $gte: ["$average_score", 0] }, then: "A" }, // Para 0 <= average_score < 14
          ],
          default: null, // Valor por defecto si no se cumple ninguna condición
        },
      },
    },
  },
]);

// Otra solucion usando "cond" ( un poco mas feo, porque hay que anidar ):
db.restaurants.updateMany({}, [
  {
    $set: {
      average_score: {
        $avg: "$grades.score",
      },
    },
  },
  {
    $set: {
      grade: {
        $cond: {
          if: { $gte: ["$average_score", 28] },
          then: "C",
          else: {
            $cond: {
              if: { $gte: ["$average_score", 14] },
              then: "B",
              else: "A", // NOTE: Quedo como default ( ie puede caer si average_score < 0)
            },
          },
        },
      },
    },
  },
]);
