Polymer. Ses promesses de permettre le développement de bibliothèque de composant UI sans s'enfermer dans une stack technique, en se reposant sur les (futurs) capacités du navigateur. Simplement écrire ses composants et les réutiliser partout en ayant la garantie de ne pas engendrer d'effet de bord. Ça donne envie, non ? Si vous travaillez avec plusieurs technos web et voulez développer un catalogue de composant UI générique, Polymer pourrait paraitre être une bonne solution.
Nous allons voir ensemble comment intégrer un composant écrit avec Polymer dans une application Angular.

## Préambule : Polymer et les Web Components

S'il devait y avoir qu'une chose à retenir :

**Polymer != Web Components**

Les Web Components sont un ensemble de 4 technologies permettant de créer et utiliser des elements dont le style et le code est encapsulé du reste de l'application. Ces 4 technologies sont basés sur des specifications du W3C dont certaines sont déjà en status Living Standard.

En 2013, des ingénieurs de chez Google ont voulu rendre accessible les Web Components en créant une surcouche à ces technos. Leur but étant de pouvoir commencer à écrire et utiliser des Web Components sans attendre que les specifications soient complètes et implémentées dans suffisament de navigateurs. Cette surcouche, au doux nom de Polymer, était voué à s'alléger - voir disparaitre - proportionellement à la couverture des navigateurs.