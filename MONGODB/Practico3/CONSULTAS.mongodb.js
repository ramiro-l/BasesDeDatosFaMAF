// ---------------------------------------------------------------------------------------
//  PRACTICO IX
// ---------------------------------------------------------------------------------------

use("mflix");

// ---------------------------------------------------------------------------------------
// Agregar las siguientes reglas de validación usando JSON Schema. Luego de cada
// especificación testear que efectivamente las reglas de validación funcionen,
// intentando insertar 5 documentos válidos y 5 inválidos (por distintos motivos).
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 1. Especificar en la colección users las siguientes reglas de validación: El campo name
//    (requerido) debe ser un string con un máximo de 30 caracteres, email (requerido) debe
//    ser un string que matchee con la expresión regular: "^(.*)@(.*)\\.(.{2,4})$" ,
//    password (requerido) debe ser un string con al menos 50 caracteres.
// ---------------------------------------------------------------------------------------

db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password"],
      properties: {
        name: {
          bsonType: "string",
          maxLength: 30,
          description:
            "debe ser un string de maximo 30 caracteres y es requerido",
        },
        email: {
          bsonType: "string",
          pattern: "^(.*)@(.*)\\.(.{2,4})$",
          description:
            "debe ser un string tal tiene un nombre de usuario seguido de @, un dominio con una extensión de 2 a 4 caracteres y es requerido",
        },
        password: {
          bsonType: "string",
          minLength: 50,
          description:
            "debe ser un string de minimo 50 caracteres y es requerido",
        },
      },
    },
  },
});

// db.users.getIndexes();

// Casos validos
db.users.insertMany([
  {
    name: "012345678901234567890123456789",
    email: "1@test.com",
    password: "$2b$12$UREFwsRUoyF0CRqGNK0LzO0HM/jLhgUCNNIJ9RJAqMUQ74crlJ1Vu",
  },
  {
    name: "012345678901234567890123456789",
    email: "2@test.com",
    password: "01234567890123456789012345678901234567890123456789",
  },
  {
    name: "3",
    email: "3@test.com",
    password: "01234567890123456789012345678901234567890123456789",
  },
  {
    name: "4",
    email: "4@test.com",
    password: "012345678901234567890123456789012345678901234567890",
  },
  {
    name: "5",
    email: "5@test.com",
    password: "012345678901234567890123456789012345678901234567890",
  },
]);

// Casos invalidos
db.users.insertOne({
  name: "012345678901234567890123456789***",
  email: "1@test.com",
  password: "$2b$12$UREFwsRUoyF0CRqGNK0LzO0HM/jLhgUCNNIJ9RJAqMUQ74crlJ1Vu",
});
db.users.insertOne({
  name: "012345678901234567890123456789",
  email: "2test.com",
  password: "01234567890123456789012345678901234567890123456789",
});
db.users.insertOne({
  name: "3",
  email: "3@test.12345",
  password: "01234567890123456789012345678901234567890123456789",
});
db.users.insertOne({
  name: "4",
  email: "4@test.com",
  password: "012345678901234567890123456789012345678901234567890",
});
db.users.insertOne({
  name: "5",
  email: "5@test.com",
  password: "0",
});

// ---------------------------------------------------------------------------------------
// 2. Obtener metadata de la colección users que garantice que las reglas de validación
//    fueron correctamente aplicadas.
// ---------------------------------------------------------------------------------------

db.getCollectionInfos({ name: "users" });

// ---------------------------------------------------------------------------------------
// 3. Especificar en la colección theaters las siguientes reglas de validación: El campo
//    theaterId(requerido) debe ser un int y location(requerido) debe ser un object con:
//      a. un campo address(requerido) que sea un object con campos street1, city, state
//         y zipcode todos de tipo string y requeridos
//      b. un campo geo(no requerido) que sea un object con un campo type, con valores
//         posibles “Point” o null y coordinates que debe ser una lista de 2 doubles
//      Por último, estas reglas de validación no deben prohibir la inserción o
//      actualización de documentos que no las cumplan sino que solamente deben advertir.
// ---------------------------------------------------------------------------------------

db.runCommand({
  collMod: "theaters",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["theaterId", "location"],
      properties: {
        theaterId: {
          bsonType: "int",
          description: "debe ser un int y es requerido",
        },
        location: {
          bsonType: "object",
          required: ["address"],
          properties: {
            address: {
              bsonType: "object",
              required: ["street1", "city", "state", "zipcode"],
              properties: {
                street1: {
                  bsonType: "string",
                  description: "debe ser un string y es requerido",
                },
                city: {
                  bsonType: "string",
                  description: "debe ser un string y es requerido",
                },
                state: {
                  bsonType: "string",
                  description: "debe ser un string y es requerido",
                },
                zipcode: {
                  bsonType: "string",
                  description: "debe ser un string y es requerido",
                },
              },
            },
            geo: {
              bsonType: "object",
              properties: {
                type: {
                  enum: ["Point", null],
                  description: "debe ser Point o null y no es requerido",
                },
                coordinates: {
                  bsonType: "array",
                  minItems: 2,
                  maxItems: 2,
                  items: {
                    bsonType: "double",
                  },
                  description:
                    "debe ser una lista que contenga exactamente 2 doubles y no es requerido",
                },
              },
            },
          },
        },
      },
    },
  },
  validationAction: "warn", // NOTE: cambiar por "error" para debuggear
});

// db.theaters.findOne();
// db.getCollectionInfos({ "name": "theaters" });
// db.theaters.getIndexes();

// Casos validos
db.theaters.insertOne({
  theaterId: 99999,
  location: {
    address: {
      street1: "340asd W Market",
      city: "Bloasdomington",
      state: "MNasd",
      zipcode: "55sad425",
    },
    geo: {
      type: "Point",
      coordinates: [-83.24565, 42.85466],
    },
  },
});

// Casos no validos
db.theaters.insertOne({
  theaterId: "99999",
  location: {
    address: {
      street1: "340asd W Market",
      city: "Bloasdomington",
      state: "MNasd",
      zipcode: "55sad425",
    },
    geo: {
      type: "Point",
      coordinates: [-83.24565, 42.85466],
    },
  },
});
db.theaters.insertOne({
  theaterId: 99999,
  location: {
    address: {
      street1: 1,
      city: "Bloasdomington",
      state: "MNasd",
      zipcode: "55sad425",
    },
    geo: {
      type: "Point",
      coordinates: [-83.24565, 42.85466],
    },
  },
});
db.theaters.insertOne({
  theaterId: 99999,
  location: {
    address: {
      street1: 1,
      city: "Bloasdomington",
      state: "MNasd",
      zipcode: "55sad425",
    },
    geo: {
      type: "Point",
      coordinates: [-83.24565],
    },
  },
});

// ---------------------------------------------------------------------------------------
// 4. Especificar en la colección movies las siguientes reglas de validación: El campo title
//    (requerido) es de tipo string, year(requerido) int con mínimo en 1900 y máximo en 3000,
//    y que tanto cast, directors, countries, como genres sean arrays de strings sin
//    duplicados.
//       a. Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora
//          de insertar documentos.Recordar que mongo shell es un intérprete javascript y
//          en javascript los literales numéricos son de tipo Number(double).
// ---------------------------------------------------------------------------------------

// db.movies.findOne();

db.runCommand({
  collMod: "movies",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "year"],
      properties: {
        title: {
          bsonType: "string",
          description: "debe ser un string y es requerido",
        },
        year: {
          bsonType: "int",
          minimum: 1900,
          maximum: 3000,
          description: "debe ser un int entre 1900 y 3000 y es requerido",
        },
        cast: {
          bsonType: "array",
          uniqueItems: true,
          items: {
            bsonType: "string",
          },
          description: "debe ser un array de strings sin duplicados",
        },
        directors: {
          bsonType: "array",
          uniqueItems: true,
          items: {
            bsonType: "string",
          },
          description: "debe ser un array de strings sin duplicados",
        },
        countries: {
          bsonType: "array",
          uniqueItems: true,
          items: {
            bsonType: "string",
          },
          description: "debe ser un array de strings sin duplicados",
        },
        genres: {
          bsonType: "array",
          uniqueItems: true,
          items: {
            bsonType: "string",
          },
          description: "debe ser un array de strings sin duplicados",
        },
      },
    },
  },
});

// Casos validos
db.movies.insertOne({
  title: "The title",
  year: NumberInt(2021),
  cast: ["actor1", "actor2"],
  directors: ["director1", "director2"],
  countries: ["country1", "country2"],
  genres: ["genre1", "genre2"],
});

// Casos no validos
db.movies.insertOne({
  // title: "The title",
  year: NumberInt(2021),
  cast: ["actor1", "actor2"],
  directors: ["director1", "director2"],
  countries: ["country1", "country2"],
  genres: ["genre1", "genre2"],
});

db.movies.insertOne({
  title: "The title",
  year: "2021", // Debe ser un int
  cast: ["actor1", "actor2"],
  directors: ["director1", "director2"],
  countries: ["country1", "country2"],
  genres: ["genre1", "genre2"],
});

db.movies.insertOne({
  title: "The title",
  year: NumberInt(2021),
  cast: ["actor1", 1], // debe ser un array de strings
  directors: ["director1", "director2"],
  countries: ["country1", "country2"],
  genres: ["genre1", "genre2"],
});

db.movies.insertOne({
  title: "The title",
  year: NumberInt(2021),
  cast: ["actor1", "actor2"],
  directors: ["director1", "director2"],
  countries: ["country1", "country2"],
  genres: 4, // debe ser un array
});

db.movies.insertOne({
  title: "The title",
  year: NumberInt(3001), // La fecha debe ser menor o igual a 3000
  cast: ["actor1", "actor2"],
  directors: ["director1", "director2"],
  countries: ["country1", "country2"],
  genres: ["genre1", "genre2"],
});

// ---------------------------------------------------------------------------------------
// 5. Crear una colección userProfiles con las siguientes reglas de validación: Tenga un
//    campo user_id (requerido) de tipo “objectId”, un campo language (requerido) con alguno
//    de los siguientes valores [ “English”, “Spanish”, “Portuguese” ] y un campo
//    favorite_genres (no requerido) que sea un array de strings sin duplicados.
// ---------------------------------------------------------------------------------------

db.createCollection("userProfiles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "language"],
      properties: {
        user_id: {
          bsonType: "objectId",
          description: "debe ser un “objectId” y es requerido",
        },
        language: {
          bsonType: "string",
          enum: ["English", "Spanish", "Portuguese"],
          description:
            "debe ser 'English', 'Spanish' o 'Portuguese' y es requirido",
        },
        favorite_genres: {
          bsonType: "array",
          uniqueItems: true,
          items: {
            bsonType: "string",
          },
          description: "debe ser un array de strings sin duplicados",
        },
      },
    },
  },
});

// Casos validos
db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "English",
  favorite_genres: ["genre1", "genre2"],
});

db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "Spanish",
});

db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "Portuguese",
  favorite_genres: ["genre1"],
});

// Casos no validos
db.userProfiles.insertOne({
  // user_id: ObjectId(),
  language: "English",
  favorite_genres: ["genre1", "genre2"],
});

db.userProfiles.insertOne({
  user_id: ObjectId(),
  // language: "English",
  favorite_genres: ["genre1", "genre2"],
});

db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "English",
  favorite_genres: [1, "genre2"], // Debe ser un array de strings
});

db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "Cordobes", // Debe ser 'English', 'Spanish' o 'Portuguese'
  favorite_genres: ["genre1", "genre2"],
});

db.userProfiles.insertOne({
  user_id: ObjectId(),
  language: "English",
  favorite_genres: 1, // Debe ser un array
});

// ---------------------------------------------------------------------------------------
// Modelado de datos en MongoDB
// ---------------------------------------------------------------------------------------
// 6. Identificar los distintos tipos de relaciones(One-To-One, One-To-Many) en las
//    colecciones movies y comments. Determinar si se usó documentos anidados o
//    referencias en cada relación y justificar la razón.
// ---------------------------------------------------------------------------------------

// db.movies.findOne();
// db.comments.findOne();

// Respuesta: Se uso la relacion one-to-many (uno a muchos) de movies a comments,
//            utilizando referencias. La razon es porque una pelicula puede tener
//            muchos comentarios, no tiene sentido usar anidados porque no escala.
//            Y es de tipo 1 a muchos porque justamente una peli tiene muchos
//            comentarios y no uno solo.

// ---------------------------------------------------------------------------------------
// 7. (leer de la consigna, tiene imagenes)
// ---------------------------------------------------------------------------------------
// Queries comunes:
//  I.   Listar el id, titulo, y precio de los libros y sus categorías de un autor en particular
//  II.  Cantidad de libros por categorías
//  III. Listar el nombre y dirección entrega y el monto total (quantity * price) de sus
//       pedidos para un order_id dado

db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        book_id: {
          bsonType: "objectId",
        },
        title: {
          bsonType: "string",
        },
        author: {
          bsonType: "string",
        },
        price: {
          bsonType: "double",
        },
        category: {
          bsonType: "string",
        },
      },
    },
  },
});

db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        delivery_name: {
          bsonType: "string",
        },
        delivery_address: {
          bsonType: "string",
        },
        cc_name: {
          bsonType: "string",
        },
        cc_number: {
          bsonType: "string",
        },
        cc_expiry: {
          bsonType: "string",
        },
        books_details: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              title: {
                bsonType: "string",
              },
              author: {
                bsonType: "string",
              },
              price: {
                bsonType: "double",
              },
              quantuty: {
                bsonType: "int",
              },
            },
          },
        },
      },
    },
  },
});

// ---------------------------------------------------------------------------------------
// 8. (leer de la consigna, tiene imagenes)
// ---------------------------------------------------------------------------------------
