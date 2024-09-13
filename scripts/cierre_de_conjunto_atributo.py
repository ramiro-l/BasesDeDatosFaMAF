def cierre_de_conjunto_atributo(atributos, f):
    clausura = set(atributos)
    cambios = True

    while cambios:
        cambios = False
        for antecedente, consecuente in f:
            if set(antecedente).issubset(clausura):
                nuevo_resultado = clausura.union(consecuente)
                if nuevo_resultado != clausura:
                    clausura = nuevo_resultado
                    cambios = True

    return clausura


# Ejemplo de uso
F = [("A", "B"), ("A", "C"), ("CG", "H"), ("CG", "I"), ("B", "H")]
result = cierre_de_conjunto_atributo("A", F)
print("La clausura de A+ bajo F es:", result)
