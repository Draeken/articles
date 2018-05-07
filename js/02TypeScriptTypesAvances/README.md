### À traiter :

HOW-TO, Limitation & Workaround

Gérer un type générique et les valeurs possibles des propriétés de ce type
````typescript
<K>(defaultValue: K[keyof K], obj: K | undefined, propToCheck: Array<keyof K>): K[keyof K]
````

version immutable-js de TS -> tslint avec règles custom, usage de readonly/const & ReadonlyArray
Reprendre la doc sur les type guard ? les modificateur d'interface (readonly, optional) ?

limitation: pas de typage pour les fonctions récursives - variadic type (en cours)

## liens :
https://github.com/Microsoft/TypeScript/issues/5453