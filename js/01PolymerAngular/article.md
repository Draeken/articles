Polymer. Ses promesses de permettre le développement de bibliothèque de composant UI sans s'enfermer dans une stack technique, en se reposant sur les (futurs) capacités du navigateur. Simplement écrire ses composants et les réutiliser partout en ayant la garantie de ne pas engendrer d'effet de bord. Ça donne envie, non ? Si vous travaillez avec plusieurs technos web et voulez développer un catalogue de composant UI générique, Polymer pourrait paraitre être une bonne solution.
Nous allons voir ensemble comment intégrer un composant écrit avec Polymer dans une application Angular.

## Préambule : Polymer et les Web Components

S'il devait y avoir qu'une chose à retenir :

**Polymer != Web Components**

Les Web Components, apparus pour la première fois en 2011, sont un ensemble de 4 technologies permettant de créer et utiliser des elements dont le style et le code est encapsulé du reste de l'application. Ces 4 technologies sont basés sur des specifications du W3C dont certaines sont déjà en status Living Standard.

En 2013, des ingénieurs de chez Google ont voulu rendre accessible les Web Components en créant une surcouche à ces technos. Leur but étant de pouvoir commencer à écrire et utiliser des Web Components sans attendre que les specifications soient complètes et implémentées dans suffisament de navigateurs. Cette surcouche, au doux nom de Polymer, était voué à s'alléger - voir disparaitre - proportionellement à la couverture des navigateurs.

Ces 4 technologies sont :

### Les Custom Elements
Ce sont des API JS permettant de définir vos elements HTML et leur comportement associé. Après l'appel à `CustomElementRegistry.define()`, vous pourez ensuite utiliser le tag correspondant dans votre HTML.
Ils définissent également les Life cycle callbacks de l'élement que Polymer reprend.

### Le Shadow DOM
C'est ce qui va permettre d'encapsuler la structure HTML et le style de l'élement, sans que le monde extérieur puisse interférer de manière non controlé.
Polymer gère le Shadow DOM pour nous tout en nous permettant de le manipuler

### Les HTML Template
Cette techno défini deux élements. `<template>`, qui permet d'écrire du HTML non rendu et qui sera copié dans les élements qui les utilisent. Le `<slot>` nous laisse écrire un espace dans notre structure HTML où les élements enfants de notre élements viendront s'insérer.

### Les HTML Import
Si vous avez écrit votre Web Component dans son fichier .html dédié, un moyen de l'utiliser dans votre application est de l'importer via un import HTML :
````HTML
<link rel="import" href="myfile.html">
````
Cette techno est sujet à controverse et ne sera finalement pas adopté par le standart. Selon Firefox, les outils présent et à venir (ES6 Module) sont suffisant et offrent plus de contrôle que les HTML Import.

**Les ajouts de Polymer**

Au delà de faire fonctionner ces 4 technos sur tous les navigateurs, on trouvera dans la boite à outil Polymer de quoi faciliter le développement des Web Components :
- Helper pour déclarer les propriétés de notre composant (valeur par défaut, read-only, calculé, fonction observatrice, déserialisation automatique)
- Gestion des évènements (inscription & désinscription automatique, évènements gestuelles pour les mobinautes)
- Gestion des données, avec du 2-way data-binding
- Custom elements équivalent aux ngIf et ngFor d'Angular
- Debouncer pour éviter d'appeler une callback à interval trop serré

En plus de ces fonctionnalités de base, Polymer fourni des solutions pour développer des applications complètes (gestion des routes, internationalisation, gestion du hors-connexion), peu utiles dans le cas où c'est déjà géré par Angular.

### et Angular ?
Angular débuta après Polymer, en septembre 2014. Mais à l'inverse de Polymer, les composants Angular ne sont pas des Web Components. Ils utilisent des techniques propre à ceux-ci, comme une émulation du shadow dom (qui peut aussi être activé nativement) pour l'encapsulation du style, mais on ne peut pas utiliser un composant Angular dans un autre environement qu'Angular.

## L'intégration Angular & Polymer
Pour illustrer cette intégration, nous allons voir deux manières: l'une simple et rapide bien pour tester et l'autre plus adaptée à un environement de production.

Dans les deux cas, vous aurez besoin de bower.

### La manière simple
Dans ce cas de figure, les customs elements seront développés localement, connexes au projet Angular. Les éléments sont importés dans l'index.html.

1. À la racine de votre projet, initialisé bower avec
````bash
$ bower init
````
Les demandes du prompt ne sont pas intéréssant car nous ne publierons pas via bower. Notre utilisation se cantonnera à gérer les dépendences Polymer.

2. Toujours à la racine, créez un fichier `.bowerrc` avec ce contenu :
````json
{
  "directory": "src/assets/bower_components/"
}
````
où `assets` correspond à votre répertoire d'assets Angular.

3. Dans le `.gitignore`, rajoutez le chemin du `.bowerrc`.

Pour l'exemple, nous utiliserons des éléments développés par l'équipe Polymer.

4. Installez les éléments `paper-slider` et `paper-card`
````bash
$ bower install --save PolymerElements/paper-slider PolymerElements/paper-card
````

5. Ajoutez vos dépendances dans l'index.html.
````html
<head>
  <link rel="import" href="assets/bower_components/paper-card/paper-card.html">
  <link rel="import" href="assets/bower_components/paper-slider/paper-slider.html">
</head>

<body>
  <app-root></app-root>
</body>
````

6. Pour pouvoir utiliser vos nouveaux élements, il faut autoriser les balises inconnues par Angular. Dans chaque module déclarant des composants utilisant des custom elements, il faut appliquer la valeur `CUSTOM_ELEMENTS_SCHEMA` à la propriété `schemas` :
````typescript
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
````

Et voilà ! Si vous voulez développez vos WebComponents en local, mettez les dans un dossier d'`assets`. N'utilisez pas polymer-cli qui vous génerera tout le nécessaire à la publication, et entrera en conflit avec les éléments dans `bower_components`.
Dans votre HTML définissant votre WebComponent, vous pourrez importer le Polymer récupéré après avoir installé des éléments depuis bower :
````html
<link rel="import" href="../bower_components/polymer/polymer.html">
````

### La manière adaptée à la prod

Plutôt que de charger tous vos composants dans le point d'entrée de votre application, vous allez les importer dans vos componnents Angular, côté TypeScript. Ceux-ci seront intégrés dans le chunk correspondant au module de votre composant, ce qui est intéressant lorsque vous lazy-loadez vos modules. Ainsi vous diminuez beaucoup la charge initiale.
Ceci est rendu possible grâce au projet [Polymer Webpack Loader](https://github.com/webpack-contrib/polymer-webpack-loader) qui va transformer vos définitions d'éléments HTML en bundle JS.

![PolymerWebackLoader fonctionnement](https://user-images.githubusercontent.com/1066253/28131928-3b257288-66f0-11e7-8295-cb968cefb040.png "Fonctionnement")

Ça tombe bien, Webpack est déjà présent et configuré via Angular CLI. Vous pouvez patcher la config généré par le CLI en utilisant Origami (Polymer + Angular) et voir un exemple d'utilisation avec ce [starter-kit](https://github.com/hotforfeature/angular-polymer-starter-kit).

Attention cependant, si vos élements hébergent des images, vous devrez changer la façon dont elles sont utilisés. Soit en déplaçant les images dans le dossier asset d'Angular de manière à ce que le `importPath` de Polymer corresponde, soit en y faisant référence via une variable :
````javascript
const img = require('./checked.png');
````
de manière à ce que l'image soit incluse dans le bundle.

## Points d'attention

Pour intégrer un élément Polymer à un formulaire Angular, il faut s'assurer qu'ils parlent la même langue !
En utilisant la directive `ngDefaultControl` sur votre composant, vous vous assurez qu'Angular prendra en compte les évènements `input` émit par votre composant.
Vérifier si le notify de value est utile
