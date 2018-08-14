## Plan
- Pourquoi vouloir typer au mieux son code ?
- Cookbook (cas d'utilisation)
  - Quand ne pas typer ?
    - retour de fonction
    - variable directement initialisé
    - paramètre d'argument de callback
    - sauf si le type inféré n'est pas assez spécifique (tableau au lieu de tuple par exemple)
  - Exprimer une différence de type la ou il y en a pas (sur une valeur primitive par exemple)
  - Gérer l'immutabilité:
    - readonly modifier d'interface et de classe
    - const
    - ReadonlyArray
- Take Away

### À traiter :

HOW-TO, Limitation & Workaround

Gérer un type générique et les valeurs possibles des propriétés de ce type
````typescript
<K>(defaultValue: K[keyof K], obj: K | undefined, propToCheck: Array<keyof K>): K[keyof K]
````

- keyof typeof
- keyof T['propertyName']
- type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

version immutable-js de TS -> tslint avec règles custom, usage de readonly/const & ReadonlyArray
Reprendre la doc sur les type guard ? les modificateur d'interface (readonly, optional) ?

limitation: pas de typage pour les fonctions récursives - variadic type (en cours) (spread operator with generics)

## liens :
https://github.com/Microsoft/TypeScript/issues/5453

https://github.com/Microsoft/TypeScript/issues/4183

https://github.com/Microsoft/TypeScript/issues/12215