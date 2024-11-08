// ------------------------------------------------------------------------------------
// Las consignas 1 a 3 se deben resolver utilizando las operaciones de consulta
// y crud básicas de MongoDB (i.e. no se puede utilizar el pipeline de
// agregación).
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
// 1. Listar el nombre (name) y barrio (borough) de todos los restaurantes de cocina
// (cuisine) tipo "Italian" y que entre sus notas (grades) tengan al menos una
// entrada con nota (grade) "A" y puntaje (score) mayor o igual a 10. La lista final
// sólo deberá mostrar 1 entrada por restaurante y deberá estar ordenada de manera
// alfabética por el barrio primero y el nombre después. Hint: Revisar operadores
// $regex y $elemMatch.
// ------------------------------------------------------------------------------------

db.restaurants.findOne();

db.restaurants.aggregate([
    {
        $match: {
            cuisine: "Italian",
            grades: {
                $elemMatch: {
                    grade: "A",
                    score: { $gte: 10 }
                }
            }
        }
    },
    {
        $project: {
            name: 1,
            borough: 1
        }
    },
    {
        $sort: {
            borough: 1,
            name: 1
        }
    }
]);

db.restaurants.find(
    {
        cuisine: "Italian",
        grades: {
            $elemMatch: {
                grade: "A",
                score: { $gte: 10 }
            }
        }
    },
    {
        name: 1,
        borough: 1
    }
).sort({
    borough: 1,
    name: 1
});


// ------------------------------------------------------------------------------------
// 2. Actualizar las panaderías (cuisine ~ Bakery) y las cafeterías (cuisine ~
// Coffee) agregando un nuevo campo discounts que sea un objeto con dos campos:
// day y amount. Si el local se ubica en Manhattan, el día será "Monday" y el
// descuento será "%10". En caso contrario el día será "Tuesday" y el descuento será
// "5%". Hint: Revisar el operador $cond.
// ------------------------------------------------------------------------------------
db.restaurants.findOne();

// Sin agregacion
db.restaurants.updateMany(
    {
        cuisine: { $in: ["Bakery", "Coffee"] },
        borough: "Manhattan"
    },
    {
        $addFields: {
            discounts: {
                day: "Monday",
                amount: "%10"
            }
        }
    }
);

db.restaurants.updateMany(
    {
        cuisine: { $in: ["Bakery", "Coffee"] },
        borough: { $not: "Manhattan" }
    },
    {
        $addFields: {
            discounts: {
                day: "Tuesday",
                amount: "%5"
            }
        }
    }
);

// Con aggregacion
db.restaurants.updateMany(
    {
        cuisine: { $in: ["Bakery", "Coffee"] }
    },
    [
        {
            $set: {
                discounts: {
                    day: {
                        $cond: {
                            if: { $eq: ["$borough", "Manhattan"] },
                            then: "Monday",
                            else: "Tuesday"
                        }
                    },
                    amount: {
                        $cond: {
                            if: { $eq: ["$borough", "Manhattan"] },
                            then: "%10",
                            else: "%5"
                        }
                    }
                }
            }
        }
    ]
);


// ------------------------------------------------------------------------------------
// 3. Contar la cantidad de restaurantes cuyo address.zipcode se encuentre entre
// 10000 y 11000. Tener en cuenta que el valor original es un string y deberá ser
// convertido. También tener en cuenta que hay casos erróneos que no pueden ser
// convertidos a número, en cuyo caso el valor será reemplazado por 0. Hint: Revisar
// el operador $convert.
// ------------------------------------------------------------------------------------

db.restaurants.findOne();

db.restaurants.find({
    $expr: {
        $and: [
            {
                $gte: [
                    {
                        $convert: {
                            input: "$address.zipcode",
                            to: "int",
                            onError: 0,
                            onNull: 0
                        }
                    },
                    10000
                ]
            },
            {
                $lte: [
                    {
                        $convert: {
                            input: "$address.zipcode",
                            to: "int",
                            onError: 0,
                            onNull: 0
                        }
                    },
                    11000
                ]
            },
        ]
    }
}).count();

// ------------------------------------------------------------------------------------
// Las consignas 4 y 5 se pueden resolver utilizando pipeline de agregación.
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
// 4. Por cada tipo de cocina (cuisine), contar la cantidad de notas distintas recibidas
// (grades.grade) en el segundo semestre de 2013. Ordenar por tipo de cocina y
// nota.
// ------------------------------------------------------------------------------------

db.restaurants.findOne();

db.restaurants.aggregate([
    {
        $project: {
            cuisine: 1,
            grades: {
                $filter:
                {
                    input: "$grades",
                    as: "item",
                    cond: {
                        $and: [
                            { $gte: ["$$item.date", ISODate("2013-06-01T00:00:00Z")] },
                            { $lte: ["$$item.date", ISODate("2013-12-31T23:59:59Z")] }
                        ]
                    }
                }
            }
        }
    },
    {
        $unwind: {
            path: "$grades",
        }
    },
    {
        $group: {
            _id: "$cuisine",
            grades: {
                $addToSet: "$grades.grade"
            }
        }
    },
    {
        $project: {
            grades_count: { $size: "$grades" }
        }
    },
]);

// ------------------------------------------------------------------------------------
// 5. Data la siguiente tabla de conversión de notas (grades.grade):
// A 5
// B 4
// C 3
// D 2
// * 1
// Donde "*" sería el resto de los casos posibles. Transformar las notas de los
// restaurantes de acuerdo a la tabla. Luego, calcular la nota promedio, máxima y
// mínima por tipo de cocina (cuisine). El resultado final deberá mostrar la cocina, la
// nota promedio, la nota máxima y la nota mínima, ordenadas de manera descendente
// por la nota promedio. Hint: Revisar el operador $switch.
// ------------------------------------------------------------------------------------

db.restaurants.aggregate([
    {
        $project: {
            cuisine: 1,
            grades: {
                $map: {
                    input: "$grades",
                    as: "i",
                    in: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$$i.grade", "A"] }, then: 5 },
                                { case: { $eq: ["$$i.grade", "B"] }, then: 4 },
                                { case: { $eq: ["$$i.grade", "C"] }, then: 3 },
                                { case: { $eq: ["$$i.grade", "D"] }, then: 2 },
                            ],
                            default: 1
                        }
                    }
                }
            }
        }
    },
    {
        $unwind: {
            path: "$grades",
        }
    },
    {
        $group: {
            _id: "$cuisine",
            grades_avg: { $avg: "$grades" },
            grades_max: { $max: "$grades" },
            grades_min: { $min: "$grades" },
        }
    },
    {
        $sort: {
            grades_avg: 1
        }
    }
]);

// ------------------------------------------------------------------------------------
// Las consignas 6 y 7 son de modelado de datos.
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
// 6. Especificar reglas de validación para la colección restaurant utilizando JSON
// Schema. Tener en cuenta los campos: 
// - address (con sus campos anidados),
// - borough, 
// - cuisine, 
// - grades (con sus campos anidados), 
// - name, 
// - restaurant_id, y
// - discount (con sus campos anidados). 
// Inferir tipos y otras restricciones que considere
// adecuadas (incluyendo campos requeridos). Agregar una regla de validación para
// que el zipcode, aún siendo un string, verifique que el rango esté dentro de lo
// permitido para New York City (i.e. 10001-11697). Finalmente dejar 2 casos de falla
// ante el esquema de validación y 1 caso de éxito. Hint: Deberán hacer conversión
// con $convert en el caso de la regla de validación. Los casos no deben ser triviales
// (i.e. sólo casos de falla por un error de tipos).
// ------------------------------------------------------------------------------------

// db.restaurants.findOne();

db.runCommand({
    collMod: "restaurants",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["address", "borough", "cuisine", "grades", "name", "restaurant_id", "discounts"],
            properties: {
                address: {
                    bsonType: "object",
                    required: ["building", "coord", "street", "zipcode"],
                    properties: {
                        building: {
                            bsonType: "string"
                        },
                        coord: {
                            bsonType: "array",
                            items: {
                                bsonType: "double"
                            },
                            minItems: 2,
                            maxItems: 2,
                        },
                        street: {
                            bsonType: "string"
                        },
                        zipcode: {
                            bsonType: "string",
                            // pattern: "^(?!10001$)(10[0-9]{3}|11[0-5][0-9]{2}|116[0-8][0-9]|1169[0-7])$",
                            // TODO: terminar para que valide que este entre 10001-11697
                        }
                    }
                },
                borough: {
                    bsonType: "string"
                },
                cuisine: {
                    bsonType: "string"
                },
                grades: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["date", "grade", "score"],
                        properties: {
                            date: {
                                bsonType: "date"
                            },
                            grade: {
                                bsonType: "string"
                            },
                            score: {
                                bsonType: "int"
                            }
                        }
                    }
                },
                name: {
                    bsonType: "string"
                },
                restaurant_id: {
                    bsonType: "string"
                },
                discounts: {
                    bsonType: "object",
                    required: ["day", "amount"],
                    properties: {
                        day: {
                            bsonType: "string"
                        },
                        amount: {
                            bsonType: "string"
                        },
                    }
                }
            },
        },
    },
    validationLevel: "strict",
    validationAction: "error",
});

// Caso valido
db.restaurants.insertOne({
    "address": {
        "building": "351",
        "coord": [
            -73.98513559999999,
            40.7676919
        ],
        "street": "West 57 Street",
        "zipcode": "10019"
    },
    "borough": "Manhattan",
    "cuisine": "Irish",
    "grades": [
        {
            "date": new Date("2013-06-01T00:00:00Z"),
            "grade": "A",
            "score": 2
        },
    ],
    "name": "Dj Reynolds Pub And Restaurant",
    "restaurant_id": "30191841",
    "discounts": {
        "day": "Monday",
        "amount": "10%"
    }
});

// Casos invalidos
db.restaurants.insertOne({
    "address": {
        "building": "351",
        "coord": [
            -73.98513559999999,
            40.7676919,
            545454545 // ESTO ESTA MAL
        ],
        "street": "West 57 Street",
        "zipcode": "10019"
    },
    "borough": "Manhattan",
    "cuisine": "Irish",
    "grades": [
        {
            "date": new Date("2013-06-01T00:00:00Z"),
            "grade": "A",
            "score": 2
        },
    ],
    "name": "Dj Reynolds Pub And Restaurant",
    "restaurant_id": "30191841",
    "discounts": {
        "day": "Monday",
        "amount": "10%"
    }
});

db.restaurants.insertOne({
    "address": {
        "building": "351",
        "coord": [
            -73.98513559999999,
            40.7676919
        ],
        "street": "West 57 Street",
        "zipcode": "10019"
    },
    "borough": "Manhattan",
    "cuisine": "Irish",
    "grades": [
        {
            "date": new Date("2013-06-01T00:00:00Z"),
            "grade": "A",
            "score": 2
        },
    ],
    "name": "Dj Reynolds Pub And Restaurant",
    "restaurant_id": 123, // esto esta mal
    "discounts": {
        "day": "Monday",
        "amount": "10%"
    }
});



// ------------------------------------------------------------------------------------
// 7. Se desean agregar "client reviews", dados por los clientes de los restaurantes. Los
// reviews cuentan de un título de menos de 50 caracteres, un puntaje entero entre 0 y
// 5, una reseña de máximo 250 caracteres (que es opcional) y una fecha y un cliente
// que lo realizó (con información de nombre y correo electrónico del cliente). Cada
// review está asociado a un restaurante y un mismo restaurante puede tener varios
// reviews. Asimismo, un cliente puede hacer reviews de varios restaurantes distintos.
// Teniendo en cuenta esto, decida la mejor manera de agregar esta información a la
// base de datos (y justifique su decisión en un comentario), genere un esquema de
// validación para dicha información y agregue algunos documentos de ejemplo.
// ------------------------------------------------------------------------------------


/**
Lo mejor seria agregar las review como un arreglo en la coleccion de restaurantes.
Debido a que un comentario no es tan grande y es facil obtener todas las review 
de un restaurante.
 */

// NOTE: DONDE ESTA ... QUEDARIA IGUAL QUE LA VALIDACION ANTERIOR.
db.runCommand({
    collMod: "restaurants",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["reviews", /* ... */],
            properties: {
                // ...
                reviews: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["date", "title", "rating", "review", "client"],
                        properties: {
                            date: {
                                bsonType: "date"
                            },
                            title: {
                                bsonType: "string",
                                maxLength: 50,
                            },
                            review: {
                                bsonType: "string",
                                maxLength: 250,
                            },
                            rating: {
                                bsonType: "int",
                                maximum: 5,
                                minimum: 0
                            },
                            client: {
                                bsonType: "object",
                                required: ["name", "email"],
                                properties: {
                                    name: {
                                        bsonType: "string",
                                    },
                                    email: {
                                        bsonType: "string",
                                    }
                                }
                            }
                        }
                    }
                },
                // ... 
            },
        },
    },
    validationLevel: "strict", // moderate
    validationAction: "error", // warn
});



// Ejemplo: 
db.restaurants.insertOne({
    // Resto de datos deben quedar igual.
    reviews: [
        {
            title: "Excelente pizza!",
            rating: 4,
            review: "La mejor pizza que he probado.",
            date: new Date("2013-06-01T00:00:00Z"),
            client: {
                name: "Carlos Gómez",
                email: "carlos.gomez@email.com"
            }
        }
    ]
});
