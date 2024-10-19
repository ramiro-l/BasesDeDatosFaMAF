# Ayudas

## Operadores de comparación

| Operador | Símbolo | Descripción           |
| -------- | ------- | --------------------- |
| `$eq`    | `=`     | **Igual a**           |
| `$ne`    | `≠`     | **No igual a**        |
| `$gt`    | `>`     | **Mayor que**         |
| `$gte`   | `≥`     | **Mayor o igual que** |
| `$lt`    | `<`     | **Menor que**         |
| `$lte`   | `≤`     | **Menor o igual que** |
| `$in`    | `∈`     | **En**                |
| `$nin`   | `∉`     | **No en**             |

### EJEMPLOS

```json
{ "edad": { "$gt": 18 } }
{ "nombre": { "$in": ["Juan", "Pedro", "Pablo"] } }
```

## Operadores lógicos

| Operador | Símbolo | Descripción |
| -------- | ------- | ----------- |
| `$and`   | `∧`     | **Y**       |
| `$or`    | `∨`     | **O**       |
| `$not`   | `¬`     | **No**      |

### EJEMPLOS

```json
{ "$and": [ { "edad": { "$gt": 18 } }, { "nombre": "Juan" } ] }
{ "$or": [ { "edad": { "$gt": 18 } }, { "nombre": "Juan" } ] }
{ "$not": { "edad": { "$gt": 18 } } }
```

## Operadores para arrays

| Operador     | Símbolo    | Descripción      |
| ------------ | ---------- | ---------------- |
| `$all`       | `∀`        | **Todos**        |
| `$elemMatch` | `∃`        | **Al menos uno** |
| `$size`      | `cardinal` | **Tamaño**       |

### EJEMPLOS

```json
{ "tags": { "$all": ["rojo", "verde"] } }
{ "tags": { "$elemMatch": { "$gte": 10, "$lt": 20 } } }
{ "tags": { "$size": 3 } }
```
