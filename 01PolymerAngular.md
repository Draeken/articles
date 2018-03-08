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
* D’autres manière d’intégrer
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


## Liens complémentaires:
https://dmitriid.com/blog/2017/03/the-broken-promise-of-web-components/

https://robdodson.me/regarding-the-broken-promise-of-web-components/

http://recurship.com/blog/2017/11/6/angular-takes-on-web-components

http://nitayneeman.com/posts/building-a-custom-element-using-angular-elements/

https://developers.google.com/web/fundamentals/web-components/

https://moduscreate.com/blog/angular-elements-ngcomponents-everywhere/

https://github.com/angular/angular/issues/20891

https://vaadin.com/blog/comparing-polymer-and-angular-from-a-developer-s-perspective

