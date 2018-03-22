# Polymer et son intégration dans Angular

## Plan

* Polymer ? Introduction
  * Pourquoi ça existe
  * Les possibilité : binding reactive
* Angular & les web components
  * Angular & Polymer, deux projets concurrents ?
* Pourquoi voudrait-on utiliser Polymer & Angular pour le même projet ?
* Le cas de STET
  * contexte
  * technique
* Exemple de composant : un input Polymer intégré à un formulaire Angular
* Demo : valide, disable, value
* Pros/cons de l’utilisation de composant Polymer avec Angular
* L’avenir de Polymer

## Polymer ?

### Contexte
Cela a commencé en mars 2013, lorsque Chrome s'est mis à supporter les custom element. Les custom elements, c'est ce qui permet de créer de nouveaux tags HTML, from scratch ou en n'en étendant. A partir de la, des googlers ont développé une surcouche pour rendre l'utilisation des custom elements plus simple.

### Capacité de base
La première chose que permet Polymer, c'est d'utiliser les capacités des custom elements sur les navigateurs qui ne le supporte pas. Il faut savoir que seul les navigateurs basés sur Blink (Chrome & Opera) supporte totalement les custom elements. Outre les custom elements, Polymer fournit un support pour trois autres piliers qui sont :

#### Les template
Permet de déclarer un bloc HTML inerte et invisibile que du js pourra cloner au besoin.

#### Le shadow dom
Permet d'isoler le DOM : lorsqu'on utilise un element ayant un shadow-dom, il nous est invisible depuis l'exterieur.
Isole le CSS : le style définit dans le shadow dom n'agit qu'à l'intérieur, et le style extérieur n'a pas d'effet dans le shadow-dom.
Assure la composition: un element détecte ses DOM enfant et peut faire des traitements distinctif. A la manière d'une balise select qui reconnait ses options.

#### Les HTML Import
Importe des fichiers HTML (pouvant contenir du CSS & JS). Il est possible de faire des imports dans des imports, et ceux ci ne seront parsé qu'une fois même s'ils sont importés à plusieurs endroit.

### Les ajouts
Pour nous aider a construire des web component, l'équipe Polymer a développer du data-binding, propriétés observable, calculé et un système d'évenements.
Des nouvelles fonctionnalités ont émergé et au final l'équipe de dev a poussé sa bibliothèque assez loin pour nous permettre de construire des Progressive Web App complètes rien qu'avec Polymer !

### Utilisation
On importe son web composant, Polymer et le polyfill, puis on l'utilise tel quel dans le HTML.

## Angular & les web components
Angular débuta après Polymer, en septembre 2014. Mais à l'inverse de Polymer, les composants Angular ne sont pas des Web Components. Ils utilisent des techniques des Web Components, comme une émulation du shadow dom (qui peut aussi être activé nativement) pour encapsuler leur composants mais on ne peut pas utiliser un composant Angular dans un autre environement qu'Angular.

### Cannibalisme ?
A l'origine, pas vraiment... Angular a été pensé comme framework complet pour construire de large application alors que Polymer était plus dans l'idée de faire le pont entre ce qu'ils considéraient être le futur du web et les capacités actuelles des navigateurs. C'est à dire qu'avec le temps, Polymer deviendrait de plus en plus léger et finirait par disparaitre.
Dans la pratique, j'ai l'impression que plus les framework évoluent, plus ils couvrent des choses similaires. Par exemple, il existe une équipe Angular Lab qui développe des fonctionnalités du framework hautement expérimental, et l'une de celle-ci est le Angular Element.

> Angular Component on the inside, standards on the outside.” (Rob Wormald)

Cela va permettre de continuer a écrire nos composants Angular normalement, mais a l'étape de build, il y aura une version compatible custom element, que l'on pourra utiliser dans d'autres projets sans avoir besoin d'angular. Pour moi ils ont juste repris un vrai avantage qu'avait Polymer.

De l'autre côté, on a Polymer qui met l'accent sur sa possibilité d'écrire des web app complète, avec par exemple leur système de routing, de gestion du cache, de la localisation et d'une intégration avec une DB (firebase/ PouchDB).

## Pourquoi voudrait-on utiliser les deux ?
- développer des composants qui seraient susceptible d'être utilisé dans d'autres application quelque soit la stack.
- supporter le standart et adhérer a la philosophie des custom elements. Espérer un futur ou les navigateurs supporteront pleinement les web component.
- vous êtes un shadok

## Le cas particulier
### Contexte
Il a été rapidement décidé que l'app devait être construite à base de Web Component se pliant aux spécifications W3C, même si ceux-ci étaient en draft.
React étant de fait écarté, ça s'est joué autour d'Angular & Polymer.
À l'époque, il n'y avait pas encore les Angular Elements, donc ils ont décidé de développer tous leurs composants via Polymer, écrit de manière générique, en vu d'être utilisé dans d'autres projets. Tous ces composants sont maintenu dans un catalogue à part, à base de git submodule.
Dans cette situation, le rôle d'Angular se limite à disposer les élements Polymer, communiquer avec le serveur et gérer les routes et droit d'accès.

### Technique
Pour importer nos composants Polymer, on utilise la stratégie officielle, à savoir les importer avec bower, puisque chaque composant est release via bower individuellement.
Au début, la stratégie pour intégrer les composants aux vues, c'était de charger juste ce qu'il fallait au dernier moment. Pour ça, on avait recours à décorateur custom ou on lui passait les url des composants à charger.
Cette technique était trop lourde et on a préféré tout charger dans l'index. Ça marchait bien jusqu'à ce qu'on ait trop de soucis de lenteur sur Firefox.
L'équipe de Polymer développe depuis le début des outils pour optimiser les imports, en générant des bundles. Pour les version V0 & V1 il y avait Vulcanize, puis Polymer-CLI est sorti. Il permet de build, mais uniquement les app entièrement faite avec Polymer. Heureusement on peut utiliser Polymer-build ou Polymer-bundler si on a besoin d'un contrôle plus fin sur ces process.
À côté de ça, un projet indépendant à vu le jour : polymer-webpack-loader, qui va transformer les elements HTML en bundle JS.
Ça tombe bien, angular-cli utilise Webpack. Et pour ne pas avoir à faire un ng eject et customiser la conf pour rajouter ce loader, il existe origami. Il va s'occuper de tout ça pour nous, et on a plus qu'à rendre nos composants compatible Webpack.


## Pros/cons

Les performances de Polymer sont moindre que celles d'Angular. (-0.5x)
Polymer peut être complexe a coupler à des formulaires Angular et complexifie le flow de donné. Développer un composant angular serait plus rapide et plus simple.
Le système de gestion du changement est plus lourd et complexe.
Le comportement n'est pas le même selon le navigateur (Firefox & Chrome). Il est nécessaire de faire des checks particuliers et ce n'est pas bien documenté.
Il manque des composants officiels essentiels (date picker), contrairement au projet Material2 d'angular. Depuis le passage a Polymer 2, beaucoup sont resté en Polymer 1 ou hybride. De manière générale, les composants développés pour Angular sont mieux maintenu et utilisé par plus de monde que leur homologue Polymer.
Obligé d'avoir deux système d'internationalisation : un pour polymer et un pour angular.
Pas d'asynchronisme dans le databinding de polymer (comme ce qu'on trouve avec Angular avec la pipe | async).
Pas de TypeScript, le tooling n'est vraiment pas développé par rapport à Angular.

## L'avenir de Polymer

Prochainement, Polymer sortira en version 3, abandonnant Bower et les HTML Imports au profil de NPM & les ES Module. La communauté Polymer est divisée à ce sujet. D'une part il y a ceux qui utilisaient Polymer pour sa simplicité : pas besoin de build step, juste à importer le component et ça fonctionne. Mais avec la v3, tout sera dans un fichier js. Cela ressemblera plus à ce que font les autres framework et c'est justement ceux qui n'apprécient pas React, Angular & co, qui se sont réfugié dans Polymer qui sont les plus mécontents. Il sera toujours possible de séparer le HTMLL/CSS/JS dans des fichiers séparés mais cela nécessitera une étape de build. Personnellement je trouve que c'est au contraire une bonne évolution pour Polymer, le tooling sera plus développé et on pourra facilement écrire nos composants avec TypeScript.
A noter que son concurrent, Stencil, développé par Ionic, permet déjà d'écrire ses composant en TS, avec du JSX et un système de rendu inspiré de React Fiber.
Pour son intégration avec Angular, il y aura moins d'intérets avec l'arrivé d'Angular Elements, et l'utilisation de Polymer devrait donc être cantonné aux petits projets.


## Liens complémentaires:
https://dmitriid.com/blog/2017/03/the-broken-promise-of-web-components/

https://robdodson.me/regarding-the-broken-promise-of-web-components/

http://recurship.com/blog/2017/11/6/angular-takes-on-web-components

http://nitayneeman.com/posts/building-a-custom-element-using-angular-elements/

https://developers.google.com/web/fundamentals/web-components/

https://moduscreate.com/blog/angular-elements-ngcomponents-everywhere/

https://github.com/angular/angular/issues/20891

https://github.com/Polymer/project/issues/36

https://github.com/Polymer/polymer/issues/4806

https://vaadin.com/blog/comparing-polymer-and-angular-from-a-developer-s-perspective

https://custom-elements-everywhere.com/

https://github.com/webpack-contrib/polymer-webpack-loader

https://medium.com/google-developer-experts/mix-and-match-angular-custom-elements-polymer-1aee0b3d63a1

https://github.com/hotforfeature/origami
