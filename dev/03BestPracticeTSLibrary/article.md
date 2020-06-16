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

Première étape: générer ce qui sera utilisé par nos utilisateurs.
Contrairement à un projet destiné à être directement exécuté par le navigateur, nous n'avons pas besoin de beaucoup modifier notre code source.
Bundlelifier son code ? Si nos utilisateurs ne veulent qu'une partie de notre bibliothèque, l'ensemble serait malgré tout importé, ce qui aurait un impact très négatif sur la taille de leur distribuable. Il vaut mieux laisser notre lib modulaire pour laisser le choix à l'utilisateur de prendre tout ou partie.
Minimifier son code ? Notre projet sera déjà servi sur NPM gzipé. Il vaut mieux garder le code clair pour l'utilisateur. Il s'y retrouvera beaucoup plus simplement s'il doit examiner une pile d'appel avec des noms de fonctions non minimifié !
Si notre bibliothèque est utilisé dans un projet Web, il est de leur responsabilité d'embarquer une étape de build pour au moins élaguer le code mort et minimifier le reste.

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

cd my-lib
semantic-release-cli setup
````
![semantic-release setup](https://github.com/semantic-release/semantic-release/raw/caribou/media/semantic-release-cli.png)

Pour plus de détails sur ce que fait cette commande, rendez vous [ici](https://github.com/semantic-release/cli#what-it-does).

### Configurer votre package.json pour la publication

Avec l'étape précédente, le setup de semantic-release aura déjà mis à jour le package.json mais il reste quelques points à voir.
Pour que tout ce passe bien lorsqu'un utilisateur importera votre lib, il faut indiquer des points d'entrée :

package.json
````json
{
  "main": "lib/lib.js",
  "module": "es/lib.js",
  "types": "es/lib.d.ts"
}
````
Le champ `module` permet à des outils comme Rollup ou Webpack d'importer directement en ES Module.
Si ce n'est pas déjà fait, indiquez que votre package est destiné à être publique :

package.json
````json
{
  "private": false,
  "publishConfig": {
    "tag": "latest",
    "access": "public"
  }
}
````

Si vos modules ne génèrent pas d'effet de bord, vous pouvez également rajouter :

package.json
````json
{
  "sideEffects": false
}
````

qui permettra à Webpack (v4) d'optmisier les re-exports, menant à des bundles plus léger.

### L'intégration continue

Avec les options par défaut, le setup de semantic-release génère un fichier de conf dédié à Travis (`travis.yml`). Pour une base minimale, cette conf est suffisante. Si ce n'est pas déjà fait, ouvrez un compte sur https://travis-ci.org/ avec votre compte GitHub et sélectionnez votre répo pour que Travis puisse observer les pull-request/merge. Si vous n'êtes pas fan de Travis, sachez que semantic-release supporte également CircleCI et GitLab CI de base (et vous pourrez trouver ou faire des plugins pour en supporter d'autres).

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

Nous serons plus serein en voyant ce qui sera publié avant sa publication effective ! Pour cela, utilisons la commande :
````bash
npm pack
````
qui est un dry-run de npm publish. Nous avons grâce à ça un fichier .tgz qui nous permettra de vérifier que tout est bien la, et rien de plus !

### La premire release

Maintenant que tout est en place, nous allons pouvoir voir si tout fonctionne bien. Commitons un changement avec un message type qui déclenchera une nouvelle release, par exemple `fix: presence on npm`. Les types possibles sont définis par la [convention Angular](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) (par défaut).
Les types déclenchant une release sont :
- `fix`
- `feat`
- tous les autres s'ils sont suivi d'une mention `BREAKING CHANGE`
Maintenant, soit nous poussons sur une branche, et la release sera déclenchée lors du merge de la pull request, soit nous poussons directement sur `master`. En cas de problème, la release n'aura pas lieu (si les tests sont bien fait :), donc pas de soucis à avoir.
Une fois fait, nous devrions voir une nouvelle release sur GitHub et NPM. Si ce n'est pas le cas, nous pouvons vérifier les logs de Travis - il y a toute les chances d'y trouver l'explication, et par défaut il n'y a que les logs pertinants d'affichés. On peut aussi relancer le build de Travis pour nous éviter de repousser un commit, si c'était une erreur lié au réseau par exemple.

Notre workflow nous permet maintenant de générer des releases automatiquement en analysant nos commits, mais il reste des points à améliorer. Ces points sont répartis selon deux axes : pour les utilisateurs et pour les contributeurs. Du point de vue de l'utilisateur, il est bon de lui fournir des métrics qui l'aideront à le mettre en confiance : couverture de test, dépendances à jour, doc, etc... Du point de vue du contributeur, ça se jouera sur la qualité/modularité du code et de sa documentation, et assurer une cohésion via un contrôle automatique des commits et de la coding style.

## Best Practices côté Utilisateurs

### Le Readme

Ce qui émane des articles pour passer son répo de rien à > 1000 stars, c'est que les efforts doivent concentrés sur le README. C'est la première chose que les utilisateurs voient, donc il doit être particulièrement soigné. Les images/gifs seront notamment privilégié pour montrer rapidement ce que permet la lib (on peut s'inspirer des répo qui sont dans les [GitHub Trendings](https://github.com/trending)). On pourra y inclure directement une documentation plus formelle pour une petite lib. Sinon il vaut mieux l'heberger sur une page à part (GithubPage par exemple).  Il y aussi un certains nombre de badges que l'on peut dès-à-présent afficher : la version du pacakge NPM, le badge semantic-release, le status du dernier build de Travis CI. Au fur et à mesure que l'on intègre des outils/process, il ne faut pas hésiter à ajouter le badge correspondant.

### Dépendances à jour

Avoir nos dépendances à jour nous permet de minimiser les failles de sécurité. Pour l'utilisateur, si il a des dépendances communes avec nous mais en spécifiant des versions plus récentes, NPM devra installer plusieurs version du même package (ce qui pourra mener a plusieurs duplication vu qu'il ne peut y avoir qu'une seule version d'un package qui soit partageable entre plusieurs modules). On va aussi pouvoir contrôler qu'une monté de version mineur ne casse pas notre lib (normalement, cela ne devrait pas arriver si le semantic versioning est respecté).
Pour nous aider à gérer ces dépendances, utilisons Greenkeeper. Il va générer une branche pour chaque nouvelle version d'une dépendance, en nous disant si on peut merge sans risque ou si cela nécessite de revoir notre code (Greenkeeper execute nos tests en simulant une montée de version). Le service est disponible via GitHub App et est gratuit pour les projets Open Source ; mais le plus beau dans tout ça, c'est qu'il va nous permettre de rajouter un badge pour montrer à tout le monde qu'on est bien à jour !

### Le poids de la lib

À moins de ne travailler que pour Node, les utilisateurs sont très regardant sur le poids des libs qu'ils importent. C'est pour cela que lorsque nous écrivons une lib, nous devons toujours faire en sorte qu'elle la plus petite possible. Pour y veiller, nous avons plusieurs leviers :
- Nos dépendances : est-ce qu'elles intègrent leur version en module ES6 ? Si non, sont-elles découpés en plusieurs fichiers ? En faisant un `require` d'un fichier plutôt que du main, on évitera ainsi de rajouter toute la lib dans le bundle de l'utilisateur - même si ça reste moins idéale que l'ES6 qui éliminera toute fonction non utilisée. Il est inutile de viser le 0 dépendance si cela amène à écrire du code qui a déjà été écrit. Surtout que les dépendances communes avec l'utilisateur sont dédupliqués (si disponible en module ES6).
- Notre code : je suis amené à penser qu'il vaut mieux exporter un code minimal - sans fioriture : gérer le minimum de cas possible, quitte à exporter à côté des fonctions d'aide pour gérer des cas particulier. Au mieux, l'utilisateur rentre dans le cas géré et le coût d'importation est minime, au pire, il devra gérer ça de son côté ou utiliser les fonctions d'aide fourni par la lib.
- Notre export : exporter en module ES6, mettre à jour son package.json... tout ceci a déjà été fait dans la première partie.
Pour vérifier la taille de notre lib avec toutes ses dépendances, nous pouvons créer un répo avec juste un webpack et un import d'une partie de notre lib. Ainsi on vérifiera la taille du bundle généré (en mode production !). Il y a aussi le package `size-limit`, qui indiquera la taille du bundle tel que Webpack le génerera (minimifié, gzipé), mais ça ne permet pas une grande souplesse (la taille sera différente en fonction de ce que l'utilisateur importera).

### La couverture de test

Cette étape est un incontournable pour toute bibliothèque populaire et n'ait pas compliquée à mettre en place (surtout que nos tests sont déjà écrit). Le principe est de mesurer le taux de code utilisés dans les tests, pour s'assurer que tous les cas particuliers sont testés. Notons que ce n'est pas parce qu'il y a une couverture à 100% que notre lib n'a pas de bug. En général, plus la couverture se rapproche de 100%, plus les efforts sont importants. De ce fait, le 100% n'est pas vu comme un objectif. Avoir au moins 90% est suffisant comme indice de confiance. Le setup à mettre en place va dépendre du service externe qui va s'occuper d'analyser les tests. Les plus connus sont Coveralls & Codecov, qui sont spécialisés dans la couverture de tests. Il y a aussi CodeClimate qui fait d'autres analyses de qualités en plus (gratuits pour les projets Open Source). Le setup standard consiste à ajouter un script npm pour générer un rapport de couverture (ava couplé à nyc le font très bien), et à modifier la config du CI pour envoyer ce rapport au service d'analyse.
Pour un rapport au format lcov, nous pourrons modifier notre script de test comme suit:

````json
{
  "scripts": {
    "test": "tsc && nyc --reporter=lcov npm run ava",
    "test:codecov": "tsc && nyc npm run ava",
  }
}
````

La deuxième ligne permet d'afficher le resultat du rapport dans la console. C'est un bon moyen de voir notre avancement du taux de couverture.

### La documentation

La qualité de la documentation est l'un des facteurs de choix déterminant : une bonne documentation permettra à l'utilisateur de s'assurer une prise en main simple et rapide, une compréhension complète sans avoir à fouiller le code source pour comprendre les mécanismes de notre bibliothèque. Si celle-ci est conséquente, nous avons tout intérêt à la générer à partir du code source. Le fait de documenter notre code permettra en plus aux utilisateurs d'y avoir directement accès depuis leur IDE (la taille de leur bundle ne sera pas impacté s'ils suppriment les commentaires). Dans notre cas, nous utiliserons [TypeDoc](http://typedoc.org/), qui va générer du HTML et pourra être mis sur GithubPage.

````typescript
/**
 * @param value  Comment for parameter ´value´.
 * @returns      Comment for special return value.
 */
export function bar(target:any, value:number):number;

/**
 * Comment for method ´foo´. It uses [[bar]] function

 * markdown table:
 * target |  arg  | return
 * ------ | ----- | -----
 *  'foo' | 'bar' | 42
 * @param target  Comment for parameter ´target´.
 * @returns       Comment for return value.
 */
export function foo(target:any, arg:any):number {
    return bar(target, 42);
}
````
TypeDoc reprends certains tags de JavaDoc (moins nécessaires ici vu que les types sont déjà renseignés), parse le markdown et les bloques de code présent dans les commentaires pour une belle mise en forme avec coloration syntaxique. Il est également possible de référencer d'autres fonctions/classes via la notation double crochets : `[[functionName]]`.
Nous pouvons configurer TypeDoc via le fichier typedoc.js, à la racine du projet. Cela va être utile pour exclure de la documentation nos dépendances externes, ou bien ajouter une page de garde en référant un fichier en markdown.

Une fois que le code visible par l'utilisateur est bien documenté, nous pouvons générer la doc via la commande typedoc :
````json
{
  "scripts": {
    "doc": "npm run build && typedoc --out docs/ es/"
  }
}
````
Maintenant, nous pouvons utiliser le service Github Pages pour servir le dossier docs de notre projet ! Rendez-vous sur la page des Settings de votre répo, à la section Github Pages : la, nous pouvons choisir la source de nos docs, le plus simple dans notre cas étant le dossier /docs de la branche Master. Une fois validé, nous obtiendrons le lien vers le site de la documentation, que nous pourrons renseigner dans le `README.md`