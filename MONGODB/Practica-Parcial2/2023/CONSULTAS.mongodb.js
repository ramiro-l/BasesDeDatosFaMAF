
// -----------------------------------------------------------------------------------------
// 1.Buscar las ventas realizadas en "London", "Austin" o "San Diego"; a un customer con
// edad mayor-igual a 18 años que tengan productos que hayan salido al menos 1000
// y estén etiquetados (tags) como de tipo "school" o "kids" (pueden tener más
// etiquetas).
// Mostrar el id de la venta con el nombre "sale", la fecha (“saleDate"), el storeLocation,
// y el "email del cliente. No mostrar resultados anidados.
// -----------------------------------------------------------------------------------------

db.sales.find({
    "storeLocation": { $in: ["London", "Austin", "San Diego"] },
    "customer.age": {
        $gte: 18
    },
    "items": {
        $elemMatch: {
            "price": { $gte: 1000 },
            "tags": { $in: ["school", "kids"] }
        },
    }
}, {
    "sale": "$_id",
    "saleDate": 1,
    "storeLocation": 1,
    "email": "$customer.email",
    "_id": 0
});

// -----------------------------------------------------------------------------------------
// 2. Buscar las ventas de las tiendas localizadas en Seattle, donde el método de compra
// sea ‘In store’ o ‘Phone’ y se hayan realizado entre 1 de febrero de 2014 y 31 de enero
// de 2015 (ambas fechas inclusive). Listar el email y la satisfacción del cliente, y el
// monto total facturado, donde el monto de cada item se calcula como 'price *
// quantity'. Mostrar el resultado ordenados por satisfacción (descendente), frente a
// empate de satisfacción ordenar por email (alfabético).
// -----------------------------------------------------------------------------------------

// db.sales.findOne();

db.sales.aggregate([
    {
        $match: {
            "storeLocation": "Seattle",
            "purchaseMethod": { $in: ["In store", "Phone"] },
            "saleDate": {
                $gte: ISODate("2014-02-01T00:00:00Z"),
                $lte: ISODate("2015-01-31T23:59:59Z"),
            },
        }
    },
    {
        $project: {
            "emailCustomer": "$customer.email",
            "satisfactionCustomer": "$customer.satisfaction",
            totalFacturado: {
                $sum: {
                    $map: {
                        input: "$items",
                        as: "item",
                        in: { $multiply: ["$$item.price", "$$item.quantity"] }
                    }
                }
            }
        },
    },
    {
        $sort: {
            "satisfactionCustomer": 1,
            "emailCustomer": 1
        }
    }
]);

// -----------------------------------------------------------------------------------------
// 3. Crear la vista salesInvoiced que calcula el monto mínimo, monto máximo, monto
// total y monto promedio facturado por año y mes. Mostrar el resultado en orden
// cronológico. No se debe mostrar campos anidados en el resultado.
// -----------------------------------------------------------------------------------------

// db.sales.findOne();

db.createView("salesInvoiced", "sales", [
    {
        $project: {
            "saleDate": 1,
            "totalFacturado": {
                $sum: {
                    $map: {
                        input: "$items",
                        as: "item",
                        in: { $multiply: ["$$item.price", "$$item.quantity"] }
                    }
                }
            }
        },
    },
    {
        $group: {
            _id: {
                year: { $year: "$saleDate" },
                month: { $month: "$saleDate" }
            },
            min_facturado: { $min: "$totalFacturado" },
            max_facturado: { $max: "$totalFacturado" },
            avg_facturado: { $avg: "$totalFacturado" },
            sum_facturado: { $sum: "$totalFacturado" }
        },
    },
    {
        $sort: {
            "_id.year": 1,
            "_id.month": 1
        }
    }
]);

// db.salesInvoiced.find();
// db.salesInvoiced.drop();

// -----------------------------------------------------------------------------------------
// 4. Mostrar el storeLocation, la venta promedio de ese local, el objetivo a cumplir de
// ventas (dentro de la colección storeObjectives) y la diferencia entre el promedio y el
// objetivo de todos los locales.
// -----------------------------------------------------------------------------------------

db.sales.findOne();
db.storeObjectives.findOne();

db.sales.aggregate([
    {
        $project: {
            "storeLocation": 1,
            "totalFacturado": {
                $sum: {
                    $map: {
                        input: "$items",
                        as: "item",
                        in: { $multiply: ["$$item.price", "$$item.quantity"] }
                    }
                }
            }
        },
    },
    {
        $group: {
            _id: "$storeLocation",
            avgVentas: {
                $avg: "$totalFacturado"
            }
        }
    },
    {
        $lookup: {
            from: "storeObjectives",
            localField: "_id",
            foreignField: "_id",
            as: "storeObjective",
        },
    },
    {
        $unwind: "$storeObjective",
    },
    {
        $project: {
            "storeLocation": 1,
            "avgVentas": 1,
            "storeObjectives": "$storeObjective.objective",
            "avgVentasSubStoreObjectives": { $subtract: ["$avgVentas", "$storeObjective.objective"] }
        },
    },
]);

// -----------------------------------------------------------------------------------------
// 5. Especificar reglas de validación en la colección sales utilizando JSON Schema.
//      a. Las reglas se deben aplicar sobre los campos: saleDate, storeLocation,
//         purchaseMethod, y customer ( y todos sus campos anidados ). Inferir los
//         tipos y otras restricciones que considere adecuados para especificar las
//         reglas a partir de los documentos de la colección.
//      b. Para testear las reglas de validación crear un caso de falla en la regla de
//         validación y un caso de éxito (Indicar si es caso de falla o éxito)
// -----------------------------------------------------------------------------------------

// db.sales.find();

// Ejemplo para calcular los valores para validar un enum:
// db.sales.distinct("purchaseMethod");
db.getCollectionInfos({ name: "sales" })

// a)
db.runCommand({
    collMod: "sales",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["saleDate", "storeLocation", "customer", "couponUsed", "purchaseMethod", "items"],
            properties: {
                saleDate: {
                    bsonType: "date",
                    description: "tiene que ser una fecha y es requerido"
                },
                storeLocation: {
                    bsonType: "string",
                    description: "tiene que ser una string y es requerido"
                },
                couponUsed: {
                    bsonType: "bool",
                    description: "tiene que ser una bool y es requerido"
                },
                purchaseMethod: {
                    enum: ["Online", "In store", "Phone"],
                    description: "tiene que ser 'Online', 'In store' o 'Phone' y es requerido"
                },
                customer: {
                    bsonType: "object",
                    required: ["gender", "age", "email", "satisfaction"],
                    properties: {
                        gender: {
                            enum: ["M", "F"]
                        },
                        age: {
                            bsonType: "int",
                            minimum: 0,
                            maximum: 100,
                        },
                        email: {
                            bsonType: "string",
                            pattern: "^(.*)@(.*)\\.(.{2,4})$",
                            description:
                                "debe ser un string tal tiene un nombre de usuario seguido de @, un dominio con una extensión de 2 a 4 caracteres y es requerido",
                        },
                        satisfaction: {
                            bsonType: "int",
                        }
                    }
                },
                items: {
                    bsonType: "array",
                    items: {
                        bsonType: "object",
                        required: ["name", "tags", "price", "quantity"],
                        properties: {
                            name: {
                                bsonType: "string"
                            },
                            tags: {
                                bsonType: "array"
                            },
                            price: {
                                bsonType: "double"
                            },
                            quantity: {
                                bsonType: "int"
                            }
                        }
                    },
                }
            },
        },
    },
});

// b)

// Caso exitoso:
db.sale.insertOne({
    "saleDate": {
        "$date": "2015-03-23T21:06:49.506Z"
    },
    "items": [
        {
            "name": "mate",
            "tags": [
                "office",
            ],
            "price": {
                "$numberDecimal": "40.01"
            },
            "quantity": 2
        }
    ],
    "storeLocation": "Cordoba",
    "customer": {
        "gender": "M",
        "age": 20,
        "email": "cacho@ejemplo.com",
        "satisfaction": 4
    },
    "couponUsed": true,
    "purchaseMethod": "Online"
});

// Casos de falla:
db.sale.insertOne({
    "saleDate": {
        "$date": "2015-03-23T21:06:49.506Z"
    },
    "items": [
        {
            "name": "mate",
            "tags": [
                "office",
            ],
            "price": {
                "$numberDecimal": "40.01"
            },
            "quantity": 2
        }
    ],
    "storeLocation": "Cordoba",
    "customer": {
        "gender": "EEEEEEEEEEEEEEEEEEEEE", // ACA HAY UN ERROR
        "age": 20,
        "email": "cacho@ejemplo.com",
        "satisfaction": 4
    },
    "couponUsed": true,
    "purchaseMethod": "Onlineee" // ACA HAY OTRO ERROR
});
