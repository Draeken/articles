# Polymer et son intégration dans Angular

## Plan

* Polymer ? Introduction
  * Pourquoi ça existe
  * Les possibilité : binding reactive
* Angular & les web components
  * Angular & Polymer, deux projets concurrents ?
* Pourquoi voudrait-on utiliser Polymer & Angular pour le même projet ?
* Le cas de STET
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
Des nouvelles fonctionnalités ont émergé et au final l'équipe de dev a poussé sa bibliothèque assez loi pour nous permettre de construire des Progressive Web App complètes rien qu'avec Polymer !

### Utilisation
On importe le composant Polymer et on l'utilise tel quel dans le HTML.
A-t-on besoin d'importer des polyfill ou Polymer ?

## Angular & les web components
Angular débuta après Polymer, en septembre 2014. Mais à l'inverse de Polymer, les composants Angular ne sont pas des Web Components. Ils utilisent des techniques des Web Components, comme une émulation du shadow dom (qui peut aussi être activé nativement) pour encapsuler leur composants mais on ne peut pas utiliser un composant Angular dans un autre environement qu'Angular.

## Liens complémentaires:
https://dmitriid.com/blog/2017/03/the-broken-promise-of-web-components/
https://robdodson.me/regarding-the-broken-promise-of-web-components/
