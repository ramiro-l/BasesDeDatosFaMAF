// ---------------------------------------------------------------------------------------
//  PRACTICO IX
// ---------------------------------------------------------------------------------------

use("mflix");

// ---------------------------------------------------------------------------------------
// 1. Especificar en la colección users las siguientes reglas de validación: El campo name
//    (requerido) debe ser un string con un máximo de 30 caracteres, email (requerido) debe
//    ser un string que matchee con la expresión regular: "^(.*)@(.*)\\.(.{2,4})$" ,
//    password (requerido) debe ser un string con al menos 50 caracteres.
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 2. Obtener metadata de la colección users que garantice que las reglas de validación
//    fueron correctamente aplicadas.
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 3. Especificar en la colección theaters las siguientes reglas de validación: El campo
//    theaterId(requerido) debe ser un int y location(requerido) debe ser un object con:
//      a. un campo address(requerido) que sea un object con campos street1, city, state
//         y zipcode todos de tipo string y requeridos
//      b. un campo geo(no requerido) que sea un object con un campo type, con valores
//         posibles “Point” o null y coordinates que debe ser una lista de 2 doubles
//         Por último, estas reglas de validación no deben prohibir la inserción o 
//         actualización de documentos que no las cumplan sino que solamente deben advertir.
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 4. Especificar en la colección movies las siguientes reglas de validación: El campo title
//    (requerido) es de tipo string, year(requerido) int con mínimo en 1900 y máximo en 3000,
//    y que tanto cast, directors, countries, como genres sean arrays de strings sin
//    duplicados.
//       a. Hint: Usar el constructor NumberInt() para especificar valores enteros a la hora
//          de insertar documentos.Recordar que mongo shell es un intérprete javascript y
//          en javascript los literales numéricos son de tipo Number(double).
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 5. Crear una colección userProfiles con las siguientes reglas de validación: Tenga un
//    campo user_id(requerido) de tipo “objectId”, un campo language(requerido) con alguno
//    de los siguientes valores[ “English”, “Spanish”, “Portuguese” ] y un campo
//    favorite_genres(no requerido) que sea un array de strings sin duplicados.
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// Modelado de datos en MongoDB
// ---------------------------------------------------------------------------------------
// 6. Identificar los distintos tipos de relaciones(One - To - One, One - To - Many) en las
//    colecciones movies y comments.Determinar si se usó documentos anidados o
//    referencias en cada relación y justificar la razón.
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 7. (leer de la consigna, tiene imagenes)
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 8. (leer de la consigna, tiene imagenes)
// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
// 9. (leer de la consigna, tiene imagenes)
// ---------------------------------------------------------------------------------------