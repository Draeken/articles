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