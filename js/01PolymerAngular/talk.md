# Les Web Components avec Polymer & Angular

## Plan
- Introduction aux Web Components
- Polymer
- Angular
- Projets concurrents ?
- Pourquoi vouloir les combiner - notre choix
- Solution technique choisies
- Conclusion

## Mise en route

Polymer & Angular sont deux produits développés par Google.
Polymer est une library JS pour écrire et utiliser des WebComponents, voir une Web App.
Angular et un framework pour écrire des Web App voir des WebComponents

## Les WebComponents

Tout a commencé fin 2011, lorsqu'un employé de chez Google (Alex Russell) présente pour la première fois le concept de Web Component.
Ces Web Components sont un ensemble de 4 technos permettant la création de composant réutilisable n'importe où, sans nécessiter de library, et sans risque d'effet de bord sur votre application.
Plus de problème de conflit avec le CSS, le DOM est caché, à l'abris, sans risque de se voir modifié par le monde extérieur. Et ça c'est plutôt cool, surtout en 2011.
Finalement, en mars 2013, Chrome se met à supporter les 3 technos principales des Web Components : shadow-dom, HTML Template & custom-elements. Bien sûr ce n'est pas encore le cas des autres navigateurs...
Pour rentrer un peu dans le détail de ces 3 technos, on a :
- Le Shadow Dom, qui va permettre d'encapsuler votre DOM et le style de l'élement, sans que le monde extérieur puisse interférer de manière non controlé.
- Les custom-elements, des API JS permettant d'associer une nouvelle balise HTML à une classe JS
- Les HTML Template, qui définissent deux élements. `<template>`, permet de définir un DOM caché et qui sera copié dans les élements qui les utilisent. Le `<slot>` nous laisse écrire un trou dans notre structure HTML où les élements enfants de notre élements viendront s'insérer.

## Polymer

Et Polymer dans tout ça ? Le dévelopement débuta quelques mois plus tard, en novembre 2013, avec comme intention de rendre ces technos displonible sur tous les navigateurs. La library a d'abord été conçue comme une fine couche au dessus ce que permettait la plateforme, simplifiant la création des Web Components. Le but étant que plus il y a de développeurs qui utilisent Polymer, plus les navigateurs auront de pression à implémenter le standart écrit par Google. Au final Polymer se verrait alléger proportionellement aux progrès de l'intégration des WebComponents dans les navigateurs, et à l'évolution du standart pour simplifier ces technos.

## Angular

Angular débuta peu de temps après Polymer, en septembre 2014. Mais à l'inverse de Polymer, les composants Angular ne sont pas des Web Components. Ils utilisent néanmoins certaines de leur techniques, comme une émulation du shadow dom pour encapsuler les styles. Il est même possible de l'activer nativement, sans passer par l'émulation. La grosse différence, c'est qu'on ne peut pas utiliser un composant Angular dans un autre environement qu'Angular. L'objectif de ce projet c'est d'avoir un successeur pour AngularJS - et éventuellement de ne pas laisser React, qui date de 2013, récupérer tout le marché.

## Projets concurrents ?

A l'origine, pas vraiment... Angular a été pensé comme framework complet pour construire de large application alors que Polymer était plus dans l'optique de promouvoir les Web Components, via une fine library.
Mais avec les évolutions, il y a eu de plus en plus de recouvrement :
Polymer met à disposition des éléments et outils pour construire des applications complètes :
  - routing
  - gestion du cache
  - localisation
  - intégration avec une DB (firebase/ PouchDB).
  - outil de build
et depuis Angular 6, il est possible d'exporter ses composants en Web Component, réutilisable n'importe où. En théorie, on peut maintenant faire avec Angular ce qui était avant réservé à Polymer ! Pour faire face à ça, l'équipe Polymer a récemment sorti la version 3, en abandonnant les HTML Import au profit des ES Module, et en désignant lit-element comme successeur de PolymerElement. L'équipe se repositionne avec une version ultra-légère et simplifié de leur produit.