# Mettre en place GraphQL

Lorsqu'on souhaite développer une API, peu importe la méthode d'utilisé, il y a des tâches communes.
1. Définir la sémantique de notre API, les concepts utilisés, pour s'assurer que tout le monde parle bien de la même chose.
1. Choisir le style d'architecture de l'API : évenementiel, CRUD, Hypermedia, GraphQL.
1. Formaliser le style de l'API : le format de réponse, le type d'autentification, la façon de paginer,...
1. Identifier les ressources à l'aide de la sémantique précédemment défini.
1. Souvent, les ressources sont sujettes à des états. Dans ce cas, il peut être intéressant de définir un finite state machine diagram, qui aidera également à visualiser les liens entre les ressources.
1. Formaliser l'API à l'aide d'une API Description comme Swagger ou API Blueprint (est-ce compatible avec GraphQL ?)

## L'historique

SOAP puis REST. REST étant plus accessible pour le Web (SOAP avait été conçu avec les contraintes de l'entreprise en tête). Et puis le JSON (via les API REST) est plus léger et moins verbeux que le XML (de SOAP). Les défauts de REST sont aussi sa première qualité : sa flexibilité rend les API REST moins rigoureuses, ou différentes API traiteront les choses différements. L'autentification, l'utilisation des code de retour HTTP, les schéma d'URI, la gestion des versions...Autant de sujet sur lesquelles il n'y a pas d'accord, même si des bonnes pratiques ont pu émergé au fil des années.

## L'arrivée de GraphQL

Avec GraphQL, tout est sur le même endpoint. La ou il y avait plusieurs requêtes REST, il n'y en a plus qu'une avec GraphQL. Le client demande ce qu'il souhaite comme donnée, ce qui diminue la dépendance avec le fournisseur. C'est pour ces raisons qu'on a vu beaucoup d'acteur du numérique migrer vers GraphQL (https://graphql.github.io/users/). Il n'y a plus le problème propre à REST qui n'était pas auto-documenté : à moins de gérer correctement les versions, un changement dans l'API pouvait entrainer des erreurs chez ses consommateurs. GraphQL repose sur un schéma convenu par les différentes parties qui une fois défini, permet à chacun de développer de son côté en ayant l'assurance d'une intégration réussie. Contrairement aux API REST, GraphQL ne favorise pas un protocole d'échange particulier. Cela peut être HTTP, TCP, WebSocket...

## Features

Il est possible de formaliser des formats de donnée personnalisé, tant que c'est sérialisable et compatible avec le protocole d'échange utilisé. GraphQL supporte par défaut les types String, Int, Float et Enum.

## Définition du schéma

Lorsqu'on écrit le schéma de l'API, on peut indiquer qu'une ressource intègre une autre. Le schéma comprends toutes les ressources de l'API, ainsi que des types racines : Query, Mutation, Subscription, permettant de définir des méthodes pour respectivement rechercher/modifier les ressources, ou recevoir des notifications lors d'un changement.
Comment refléter une relation Neo4J avec propriété dans un schema GraphQL ?

## Intégration de GraphQL

Il y a trois façon d'intégrer GraphQL :
1. directement connecté à une BDD
1. en interaction avec une couche qui servira d'interface entre l'API GraphQL et un système existant (plusieurs BDD, système complexe...)
1. en hybride, directement connecté à une BDD et à une interface pour un autre système.

Cette flexibilité est rendu possible grâce au système de resolver: chaque champ du schéma correspond à une fonction qui va s'occuper de récupérer la donnée lié. On pourrait se dire que si on veut récupérer tous les champs d'une ressource, cela fait autant d'appelle de fonction qu'il y a de champs. Et comment les performances peuvent rivaliser avec une fonction qui executerait un simple _select_ des champs requis.

typeDef + resolvers = schema

Pour éviter de récupérer plusieurs fois la même donnée, il y a DataLoader, mais ça ne résout qu'une partie du problème.
Si ces champs font partis d'une ressource, elle peut avoir son _resolver_ qui va récupérer cette ressource. Lorsque GraphQL execute les _resolvers_ des attributs demandées pour cette ressource, celle-ci est déjà en mémoire, et il n'y a plus qu'à retourner les propriétés correspondantes. Chaque _resolver_ reçoit 4 arguments. Dans le premier : `root`, on récupère le résultat du _resolver_ racine. C'est grâce à `root` qu'on peut renvoyer les propriétés correspondantes. `args` permet de récupérer les arguments donné lors de la requête de ce champ. `context` est un objet partagé pour la requête en cours : les resolvers peuvent communiquer via cet objet partagé. Le dernier, `info` est une représentation _AST_ de la requête/mutation.
En tout cas, ces fonctions sont écrites côté serveur, pour laisser au client un unique _endpoint_ qui analysera ses demandes. On transfers ainsi la complexité de la construction de la donnée au niveau du serveur.
Pour faciliter la création de requête, GraphQL met à disposition plusieurs outils :
- Les variables : lorsqu'on utilise des fonctions paramétrées, plutôt que de mettre l'argument écrit en dure, on peut utiliser une variable, et fournir en plus de la requête un objet JSON contenant un dictionnaire de ces variables. Cela évite aussi d'avoir à construire la requête à l'exécution via une chaine d'interpolation qui incorporerait des données venant du client (potentielle faille de sécurité).
- On peut éviter la redondance grâce au _fragment_ qui correspond à un sous ensemble de champs d'un type donné. On peut aussi transmettre des variables à travers un fragment.
- Des directives, permettant d'inclure ou non un champ à partir d'une variable.

Une fonction de requête peut retourner une union de types (une union de type concret, pas d'union d'autres unions ou d'interface). Dans ce cas, l'utilisateur pourrait avoir envie de décider quel champ retourner en fonction du type de l'élément. GraphQL a introduit une syntaxe particulière à cet effet :
```
... on MyTypeA {
  fieldFromA
}
... on MyTypeB {
  fieldFromB
}
```
Cette syntaxe correspond à des _inline fragment_, une version moins verbeuse qu'un _fragment_ nommé :
```
fragment MyFragment on MyTypeA {
  fieldFromA
}
```
mais qui a l'avantage de pouvoir être utilisé à plusieurs endroits.

S'il n'y a pas de champ discriminant retourné, l'utilisateur peut demander le champ __typename, un champ méta disponible à n'importe quel endroit de la requête.

Si l'on souhaite développer son API GraphQL en JS, il existe GraphQL.js, de Facebook. graph-tool s'appuie sur GrapQL.js et ajoute la possibilité de définir automatiquement ses resolvers. On perd cependant en flexibilité et si l'on souhaite modifier son schema au runtime par exemple, il sera necessaire de passer directement par graphql.js

## La fusion de plusieurs API GraphQL (Schema stitching) ?

Cela permet de n'avoir qu'un seul schéma à partir de plusieurs schémas exécutables. Les types racines sont rassemblés. Si ces schémas sont liés, on peut expliciter ces liens à travers la définition d'un nouveau schéma, qui étendras les types existants pour leur rajouter des champs dont le type proviendra à l'origine d'un autre schéma. Les _resolvers_ de ces nouveaux champs pourront déléguer la recherche en indiquant le schéma d'origine et le nom du champ, ainsi que les arguments à donner.

[source](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html)

Pour protéger son API, plusieurs méthodes. Déjà, on peut voir [comment GitHub à procédé](https://developer.github.com/v4/guides/resource-limitations/).
Les différentes voies pour limiter les requêtes sont :
1. Timeout pour des requêtes trop longues
1. Limiter la profondeur des requêtes
1. Limiter la complexité de la requête (chaque champ a une complexité défini, celle de la requête est la somme des complexités)
1. Imposer une limite par client via le _leaky bucket algorithm_, de temps serveur, ou de complexité.

Côté front, des bibliothèques comme Relay ou Apollo permettent d'abstraire le bas niveau de la gestion de la donnée pour permerttre simplement de décrire la donnée souhaiter et de la traiter ensuite.