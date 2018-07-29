Au cours du développement de nos projets, on peut se retrouver à écrire du comportement générique, susceptible d'être réutilisé autre part. Mais on est peut être en train de réinventer la roue si ce comportement est déjà distribué publiquement... Si ce n'est pas le cas, on pourrait être tenté de le mettre à disposition.
Nous allons voir ensemble quel workflow nous permettrait de publier et maintenir simplement une bibliothèque Open Source écrit en TypeScript.

## Automatiser les releases

Pour ne pas se casser la tête à gérer les releases, nous utiliserons semantic-release. Le principe est simple : lorsque du nouveau code est poussé sur Master, si les tests d'intégration continue passent, une nouvelle release est déclenchée. Cela implique que les releases seront très fréquentes, mais ça nous force à suivre les bonnes pratiques, et à respecter la règle que master doit toujours être déployable. Si nous avons besoin davantage de contrôle, nous pouvons utiliser une branche dev au lieu de master par défaut, et merger dev sur master lorsque nous voulons déclencher une nouvelle release. Nous pouvons aussi distribuer la lib sur un tag npm autre que `@last`, comme `@next` ou `@canary` par exemple.
Pour l'exemple, nous partirons de la structure suivante :

- src (nos sources)
- test (tests unitaires)
- es (contiendra les sources transpilées en ES Module)
- lib (contiendra les sources transpilées en CommonJS)
- build (contiendra les sources transpilées pour exécuter les tests)

## Le build

Première étape: générer ce qui sera utilisé par nos utilisateurs.
Contrairement à un projet destiné à être directement exécuté par le navigateur, nous n'avons pas besoin de beaucoup modifier notre code source.
Bundlelifier son code ? Si nos utilisateurs ne veulent qu'une partie de notre bibliothèque, l'ensemble serait malgré tout importé, ce qui aurait un impact très négatif sur la taille de leur distribuable. Il vaut mieux laisser notre lib modulaire pour laisser le choix à l'utilisateur de prendre tout ou partie.
Minimifier son code ? Notre projet sera déjà servi sur NPM gzipé. Il vaut mieux garder le code clair pour l'utilisateur. Il s'y retrouvera beaucoup plus simplement s'il doit examiner une pile d'appel avec des noms de fonctions non minimifié !
Si notre bibliothèque est utilisé dans un projet Web, il est de leur responsabilité d'embarquer une étape de build pour au moins élaguer le code mort et minimifier le reste.

Si nous partons de la config TS de base suivante :

tsconfig.base.json

```json
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
```

Ajoutons la config TS pour générer les sources du livrable :

tsconfig.build.json

```json
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
```

Et les scripts pour générer le livrable :

package.json

```json
{
  "scripts": {
    "build:ts": "tsc -p tsconfig.build.json",
    "build": "npm run build:ts && npm run build:ts -- -m es6 --outDir es"
  }
}
```

Il n'y a plus qu'à lancer `npm run build` pour générer la sortie en commonjs et la sortie en es6.

## Les tests

Pour éviter de mettre sur une NPM une release qui ne fonctionne pas, il est indispensable que chaque merge candidat à une nouvelle release passe une batterie de test ! Pour l'exemple nous utiliserons [AVA](https://github.com/avajs/ava). C'est moderne (avec le support d'ES6), simple d'utilisation et ça supporte les promesses, async await et les observables !

test/lib.test.ts

```typescript
import test from "ava";
import { myLibFunction } from "../src/lib";

test("will work", t => {
  const result = myLibFunction();
  t.truthy(result);
});
```

Pour exécuter les tests, AVA a besoin des fichiers transpilés en js. Mettons en place un build par défaut qui sera utilisé par les tests :

tsconfig.json

```json
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
```

Ajoutons les scripts nécessaire à executer les tests :

package.json

```json
{
  "scripts": {
    "ava": "ava build/**/*.test.js",
    "test": "tsc && npm run ava"
  }
}
```

Pour simplifier le développement, nous pouvons également ajouter un script qui va builder et tester à chaque modification du code.
Le package concurrently nous permettra d'exécuter en parallèle le build et l'exécution des tests.

```bash
npm i -D concurrently
```

package.json

```json
{
  "scripts": {
    "watch:ts": "tsc -w",
    "watch:ava": "ava -w build/*.test.js",
    "watch:test":
      "concurrently -k -p \"[{name}]\" -n \"TypeScript,Ava\" -c \"blue.bold,magenta.bold\" \"npm run watch:ts\" \"npm run watch:ava\""
  }
}
```

Voilà, maintenant vous n'aurez plus qu'à lancer `npm run watch:test` pour faciliter votre pratique du TDD !

## Configurer semantic-release

`semantic-release` s'appuie fortement sur un système de plugin. Qu'il s'agisse de release sur NPM / GitHub / GitLab, de s'interfacer avec la plateforme de CI, d'analyser les commits et de générer le CHANGELOG, tout est fait via des plugins. Certains sont officiels, d'autres communautaires. `semantic-release` est configuré par défaut avec certains plugins officiels pour supporter le cas d'usage le plus courant : GitHub, NPM & Travis. Pour simplifier, nous utiliserons la configuration par défaut mais sachez que leur doc est très complète et il ne vous sera pas dur de la changer. La plupart de ces plugins nécessitent l'accès à vos dépôts, et auront besoin d'un token pour Git et NPM. Cette étape peut être réalisé simplement avec leur CLI :

Assurez-vous d'avoir accès à vos identifiants GitHub et NPM, puis lancez la configuration :

```bash
npm install -g semantic-release-cli

cd my-lib
semantic-release-cli setup
```

![semantic-release setup](https://github.com/semantic-release/semantic-release/raw/caribou/media/semantic-release-cli.png)

Pour plus de détails sur ce que fait cette commande, rendez vous [ici](https://github.com/semantic-release/cli#what-it-does).

## Configurer votre package.json pour la publication

Avec l'étape précédente, le setup de semantic-release aura déjà mis à jour le package.json mais il reste quelques points à voir.
Pour que tout se passe bien lorsqu'un utilisateur importera votre lib, il faut indiquer des points d'entrée :

package.json

```json
{
  "main": "lib/lib.js",
  "module": "es/lib.js",
  "types": "es/lib.d.ts"
}
```

Le champ `module` permet à des outils comme Rollup ou Webpack d'importer directement en ES Module. Le champ type fait référence au fichier de déclaration des types généré par `tsc` pour votre lib.
Si ce n'est pas déjà fait, indiquez que votre package est destiné à être publique :

package.json

```json
{
  "private": false,
  "publishConfig": {
    "tag": "latest",
    "access": "public"
  }
}
```

Si vos modules ne génèrent pas d'effet de bord lors de leur importation (comme la modification de prototype), vous pouvez également rajouter :

package.json

```json
{
  "sideEffects": false
}
```

qui permettra à Webpack (v4) d'optimiser les re-exports, menant à des bundles plus léger.

## L'intégration continue

Avec les options par défaut, le setup de semantic-release génère un fichier de conf dédié à Travis (`travis.yml`). Pour une base minimale, cette conf est suffisante. Si ce n'est pas déjà fait, ouvrez un compte sur [https://travis-ci.org](https://travis-ci.org) avec votre compte GitHub et sélectionnez votre répo pour que Travis puisse observer les pull-request/merge. Si vous n'êtes pas fan de Travis, sachez que semantic-release supporte également CircleCI et GitLab CI de base (et vous pourrez trouver ou faire des plugins pour en supporter d'autres).

## Packager notre projet pour NPM

Cette partie va répondre à "Que fournissons-nous à l'utilisateur". Pour éviter que le `node_module` de nos utilisateurs ne se transforme en monstre, il faut rester soucieux de n'embarquer que le nécessaire :

- le package.json
- la lib
- les types

Pour cacher le superflus de NPM, créons un fichier `.npmignore` et mettons-y :

- les sources TypeScript
- les fichiers de config
- les tests
- la doc
  Sans ce fichier, NPM va par défaut se calquer sur le `.gitignore`, mais les deux usages étant vraiment séparés, ça ne suffira pas. À noter aussi que certains fichiers sont ignorés implicitement, tel que node_modules.

## Tester son packaging localement

Nous serons plus serein en voyant ce qui sera publié avant sa publication effective ! Pour cela, utilisons la commande :

```bash
npm pack
```

qui est un dry-run de npm publish. Nous avons grâce à ça un fichier .tgz qui nous permettra de vérifier que tout est bien la, et rien de plus !

## La première release

Maintenant que tout est en place, nous allons pouvoir voir si tout fonctionne bien. Commitons un changement avec un message type qui déclenchera une nouvelle release, par exemple `fix: presence on npm`. Les types possibles sont définis par la [convention Angular](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) (par défaut).
Les types déclenchant une release sont :

- `fix`
- `feat`
- tous les autres s'ils sont suivi d'une mention `BREAKING CHANGE`
  Maintenant, soit nous poussons sur une branche, et la release sera déclenchée lors du merge de la pull request, soit nous poussons directement sur `master`. En cas de problème, la release n'aura pas lieu (si les tests sont bien fait :), donc pas de soucis à avoir.
  Une fois fait, nous devrions voir une nouvelle release sur GitHub et NPM. Si ce n'est pas le cas, nous pouvons vérifier les logs de Travis - il y a toute les chances d'y trouver l'explication, et par défaut il n'y a que les logs pertinents d'affichés. On peut aussi relancer le build de Travis pour nous éviter de repousser un commit, si c'était une erreur lié au réseau par exemple. Une fois sur NPM, il ne faut pas hésiter à tester l'installation de notre lib (au moins la première fois), car les tests s'assurent que le code fonctionne, mais rien ne vérifie que les points d'entrée renseignés dans le package.json soient corrects, par exemple.

Notre workflow nous permet maintenant de générer des releases automatiquement, vous n'avez plus qu'à vous souciez du code et des tests !

## Take away

- Fournissez un build sans bundle ni minification, en supportant les modules es6
- Combinez Semantic Release et Travis CI pour faire des releases automatiques
- Écrivez vos tests simplement avec AVA, qui seront les gardes-fous de vos releases
