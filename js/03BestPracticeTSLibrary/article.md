Au cours du développement de nos projets, on peut se retrouver à écrire du comportement générique, susceptible d'être réutilisé autre part. Mais on est peut être en train de réinventer la roue si ce comportement est déjà distribué publiquement... Si ce n'est pas le cas, on pourrait être tenté de le mettre à disposition.
Nous allons voir ensemble la procédure et les bonnes pratiques de publication d'une bibliothèque Open Source écrit en TypeScript.

## Base minimale pour distribuer sa bibliothèque

Pour ne pas se casser la tête à gérer les releases, nous utiliserons semantic-release. Le principe est simple : Lorsque du nouveau code est poussé sur Master, si les tests d'intégration continue passent, une nouvelle release est déclenchée.
Pour l'exemple, nous partirons de la structure suivante :
- src (nos sources)
- test (tests unitaires)
- es (contiendra les sources transpilées en ES Module)
- lib (contiendra les sources transpilées en CommonJS)
- build (contiendra les sources transpilées pour exécuter les tests)

### Le build

Première étape: générer ce qui sera utiliser par nos utilisateurs.
Contrairement à un projet destiné à être directement exécuté par le navigateur, nous n'avons pas besoin de beaucoup modifier notre code source.
Bundlelifier son code ? Si nos utilisateurs ne veulent qu'une partie de notre bibliothèque, l'ensemble serait malgré tout importé, ce qui aurait un impact très négatif sur la taille de leur distribuable. Il vaut mieux laisser notre lib modulaire pour laisser le choix à l'utilisateur de prendre tout ou partie.
Minimifier son code ? Notre projet sera déjà servi sur NPM gzipé. Il vaut mieux garder le code clair pour l'utilisateur. Il s'y retrouvera beaucoup plus simplement s'il doit examiner une pile d'appel avec des noms de fonctions non minimifié !
Si notre bibliothèque est utilisé dans un projet Web, il est de leur responsabilité d'embarque une étape de build pour au moins élaguer le code mort et minimifier le reste.

Si nous partons de la config TS de base suivante :

tsconfig.base.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "lib": [
      "es2017",
      "dom"
    ],
    "types": [],
    "declaration": true,
    "inlineSourceMap": false,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "moduleResolution": "node"
  }
}
````

Ajoutons la config TS pour générer ce build :

tsconfig.build.json
````json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib"
  },
  "include": [
    "src/*"
  ],
  "exclude": [
    "node_modules",
    "es",
    "lib",
    "build"
  ]
}
````

Et les scripts pour générer le livrable :

package.json
````json
{
  "scripts": {
    "build:ts": "tsc -p tsconfig.build.json",
    "build": "npm run build:ts && npm run build:ts -- -m es6 --outDir es"
  }
}
````

### Les tests

Pour éviter de mettre sur une NPM une release qui ne fonctionne pas, il est indispensable que chaque merge candidat à une nouvelle release passe une batterie de tests ! Pour l'exemple nous utiliserons [AVA](https://github.com/avajs/ava).

test/lib.test.ts
````typescript
import test from 'ava'
import { myLibFunction } from '../src/lib'

test('will work', t => {
  const result = myLibFunction();
  t.truthy(result);
});
````

Pour exécuter les tests, AVA a besoin des fichiers transpilés en js. Mettons en place un build par défaut qui sera utilisé par les tests :

tsconfig.json
````json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./build",
    "baseUrl": "./",
    "sourceMap": true
  },
  "include": [
    "src/*",
    "test/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
````

Ajoutons les scripts nécessaire à executer les tests :

package.json
````json
{
  "scripts": {
    "ava": "ava build/**/*.test.js",
    "test": "tsc && npm run ava",
  }
}
````

Pour simplifier le développement, nous pouvons également ajouter un script qui va builder et tester à chaque modification du code.
Le package concurrently nous permettra d'exécuter en parallèle le build et l'exécution des tests.
````bash
npm i -D concurrently
````

package.json
````json
{
  "scripts": {
    "watch:ts": "tsc -w",
    "watch:ava": "ava -w build/*.test.js",
    "watch:test": "concurrently -k -p \"[{name}]\" -n \"TypeScript,Ava\" -c \"blue.bold,magenta.bold\" \"npm run watch:ts\" \"npm run watch:ava\""

  }
}
````
Voilà, maintenant vous n'aurez plus qu'à lancer `npm run watch:test` pour faciliter votre pratique du TDD !

### Configurer semantic-release

`semantic-release` s'appuie fortement sur un système de plugin. Qu'il s'agisse de release sur NPM / GitHub / GitLab, de s'interfacer avec la plateforme de CI, d'analyser les commits et de générer le CHANGELOG, tout est fait via des plugins. Certains sont officiels, d'autres communautaires. `semantic-release` est configuré par défaut avec certains plugins officiels pour supporter le cas d'usage le plus courant : GitHub, NPM & Travis. Pour simplifier, nous utiliserons la configuration par défaut mais sachez que leur doc est très complète et il ne vous sera pas dur de la changer. La plupart de ces plugins nécessitent l'accès à vos dépôts, et auront besoin d'un token pour Git et NPM. Cette étape peut être réalisé simplement avec leur CLI :

Assurez-vous d'avoir accès à vos identifiants GitHub et NPM, puis lancer la configuration :
````bash
npm install -g semantic-release-cli

cd your-module
semantic-release-cli setup
````
![semantic-release setup](https://github.com/semantic-release/semantic-release/raw/caribou/media/semantic-release-cli.png)

Pour plus de détails sur ce que fait cette commande, rendez vous [ici](https://github.com/semantic-release/cli#what-it-does).

### Packager notre projet pour NPM

Cette partie va répondre à "Que fournissons-nous à l'utilisateur". Pour éviter que le `node_module` de nos utilisateurs se transforme en monstre, il faut rester soucieux de n'embarquer que le nécessaire :
 - le package.json
 - la lib
 - les types

Pour cacher le superflus de NPM, créons un fichier `.npmignore` et mettons-y :
  - les sources TypeScript
  - les fichiers de config
  - les tests
  - la doc
Sans ce fichier, NPM va par défaut se calquer sur le `.gitignore`, mais les deux usages étant vraiment séparés, ça ne suffira pas. À noter aussi que certains fichiers sont ignorés implicitement, tel que node_modules.

### Tester son packaging localement

## Votre projet sur NPM
Si vous n'avez pas de compte NPM, il va être temps d'en créer un ! Ensuite vous aurez le choix de publier directement via ce compte ou via une organisation rattaché à ce compte. Publier via une organisation permet d'avoir des packages NPM scopés, et de les regrouper (comme avec @angular par exemple).