# Mettre en place GraphQL

Lorsqu'on souhaite développer une API, peu importe la méthode d'utilisé, il y a des tâches communes.
1. Définir la sémantique de notre API, les concepts utilisés, pour s'assurer que tout le monde parle bien de la même chose.
1. Choisir le style d'architecture de l'API : évenementiel, CRUD, Hypermedia, GraphQL.
1. Formaliser le style de l'API : le format de réponse, le type d'autentification, la façon de paginer,...
1. Identifier les ressources à l'aide de la sémantique précédemment défini.
1. Souvent, les ressources sont sujettes à des états. Dans ce cas, il peut être intéressant de définir un finite state machine diagram, qui aidera également à visualiser les liens entre les ressources.
1. Formaliser l'API à l'aide d'une API Description comme Swagger ou API Blueprint (est-ce compatible avec GraphQL ?)

## L'historique

SOAP puis REST. REST étant plus accessible pour le Web (SOAP avait été conçu avec les contraintes de l'entreprise en tête). Et puis le JSON (via les API REST) est plus léger et moins verbeux que le XML (de SOAP). Les défauts de REST sont aussi sa première qualité : sa flexibilité rend les API REST moins rigoureuses, ou différentes API traiteront les choses différements. L'autentification, l'utilisation des code de retour HTTP, les schéma d'URI, la gestion des versions...Autant de sujet sur lesquelles il n'y a pas d'accord, même si des bonnes pratiques ont pu émergé au fil des années. Avec GraphQL, tout est sur le même endpoint. La ou il y avait plusieurs requêtes REST, il n'y en a plus qu'une avec GraphQL. Le client demande ce qu'il souhaite comme donnée, ce qui diminue la dépendance avec le fournisseur. C'est pour ces raisons qu'on a vu beaucoup d'acteur du numérique migrer vers GraphQL (https://graphql.github.io/users/). Il n'y a plus le problème propre à REST qui n'était pas auto-documenté : à moins de gérer correctement les versions, un changement dans l'API pouvait entrainer des erreurs chez ses consommateurs. GraphQL repose sur un schéma convenu par les différentes parties qui une fois défini, permet à chacun de développer de son côté en ayant l'assurance d'une intégration réussie.

## Définition du schéma

Lorsqu'on écrit le schéma de l'API, on peut indiquer qu'une ressource intègre une autre. Le schéma comprends toutes les ressources de l'API, ainsi que des types racines : Query, Mutation, Subscription, permettant de définir des méthodes pour rechercher/modifier les ressources.
Comment refléter une relation Neo4J avec propriété dans un schema GraphQL ?