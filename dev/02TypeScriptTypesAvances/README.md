## Plan
- Pourquoi vouloir typer au mieux son code ?
- Quand ne pas typer ?
  - retour de fonction
  - variable directement initialisé
  - paramètre d'argument de callback
  - sauf si le type inféré n'est pas assez spécifique (tableau au lieu de tuple par exemple)
- Cookbook (cas d'utilisation)
  - Exprimer une différence de type la ou il y en a pas (sur une valeur primitive par exemple)
  - Gérer l'immutabilité:
    - readonly modifier d'interface et de classe
    - const
    - ReadonlyArray
  - Gérer l'exclusion de propriété grâce à Exclude
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

`as const` is a simple way to make an array tuple.

```typescript
const extraKeys = ['app', 'title', 'package', 'deeplink', 'url', 'logo', 'image', 'type'] as const;

export type Extra ={
  [key in typeof extraKeys[number]]: string;
};

const myExtra: Extra = getExtra();
myExtra.app = 'toto';
myExtra.dude = 'tata'; // throw error
```

when you have a interface like
interface Test {
  foo: {
    bar: string;
  },
  baz: {
    boo: number;
  }
}

it's possible to do:
const foo: Test['foo'] = { bar: 'baz' };


version immutable-js de TS -> tslint avec règles custom, usage de readonly/const & ReadonlyArray
Reprendre la doc sur les type guard ? les modificateur d'interface (readonly, optional) ?

limitation: pas de typage pour les fonctions récursives - variadic type (en cours) (spread operator with generics)

## liens :
https://github.com/Microsoft/TypeScript/issues/5453

https://github.com/Microsoft/TypeScript/issues/4183

https://github.com/Microsoft/TypeScript/issues/12215