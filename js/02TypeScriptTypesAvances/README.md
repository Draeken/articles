### À traiter :

HOW-TO, Limitation & Workaround

Gérer un type générique et les valeurs possibles des propriétés de ce type
````typescript
<K>(defaultValue: K[keyof K], obj: K | undefined, propToCheck: Array<keyof K>): K[keyof K]
````