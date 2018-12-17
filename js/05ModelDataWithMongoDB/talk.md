# Plan
- Petite présentation holistique de MongoDB
- Le contexte du processus décisionnel du design de donnée
  - Son expressivité schématique
    - CappedCollection & TTL
  - Ses capacités de recherche
- Modélisation de la donnée
  - Considération
  - Exemples
    - Logs
    - Aggretations

# Petite présentation holistique de MongoDB

_Schema montrant Mongo au milieu des autres SGBD_
En 2007, trois anciens de la Silicon Valley fonde une entreprise de plateforme as a service, mais ne trouvant aucun sgbd respectant leurs principes pour une architecture dans le Cloud, décident de créer le leur. À cette époque, il y a très peu de NoSQL (CouchDB et BigTable sorti en 2005). Ils sortent MongoDB en 2009, sous license OpenSource, écrit en C, C++ & JS. Il est de type NoSQL. C'est à dire qu'il va s'astreindre des contraintes trop rigides des SGBD classiques pour pouvoir garder de bonne performances en montant en volume. De plus il est orienté document, cela signifie qu'il stocke la donnée sous forme d'objet, qui a la même forme qu'un objet JSON, dans des collections. La forme de l'objet n'est pas stricte et on peut avoir des objets de forme différentes dans la même collection.
MongoDB a tenu a respecter la conformité ACID au niveau du document, et même multi-document depuis la version 4.
Lors du design, l'objectif était d'optimiser l'accessibilié des donnéees, et non l'espace disque utilisé comme à l'origine avec les SGBD.
On a la hierarchie suivante:
_Schema sur la hierarchie des artéfacts de MongoDB : DB, Collection, Document [, EmbededDocument, EmbededDocument bis (etc...x100)]_
Les EmbededDocuments sont parti intégrante du document et...Peut on vraiment les considérer comme un sous niveau de la hiérarchie ? La liaison est plus forte qu'entre DB & Collection & Document
L'entreprise abandonne son projet de plateforme as as service pour se concentre sur MongoDB.

# Le contexte du processus décisionnel du design de donnée

Lorsque l'on chercher à modéliser ses données, la difficulté est de trouver l'équilibre entre les besoins de l'application, les performances liés au moteur et les moyens d'accès à ces données. Nous allons commencer par voir ces deux derniers points.

## L'expressivité schématique

Les documents de mongoDB respectent le format BSON, pour Binary JSON. C'est un format qui binairifie le JSON. La version binaire reste légère et rapide a encoder/décoder, mais n'est pas forcément plus légère que sa version JSON. En fait la version binaire rajoute des informations comme la taille des chaine de caractères ou des sous-objets, pour permettre de traverser le JSON plus efficacement. Le BSON permet également d'avoir d'autres types de valeur, comme Date ou BinaryData. MongoDB apporte lui aussi une surcouche avec ses propres types, comme le GeoJSON pour gérer les requêtes géospatiales.
Et comme avec le JSON, on peut retrouver dans nos documents des sous documents, et des tableaux de sous documents. Il y a une limite de profondeur à 100 niveaux de sous documents.
Et chaque document est limité a 16 Mo. Il est possible de passer cette limite en utilisant GridFS, qui va diviser les documents en plusieurs parties mais rendre ça transparent pour nous.

## Les capacités de recherche

# Modélisation de la donnée

## Considérations

En général, la question que l'on va se poser lorsqu'on modélise pour MongoDB, c'est: est-ce que j'utilise des références, ou est-ce que j'intègre directement ?
Qu'est-ce que ça va changer ?
Avec les sous documents embarqués, on a des meilleures performances de lecture, car on a pas à récupérer la donnée référencée. En une seule requête on peut récupérer le document et tous ces sous-documents. Et cela permet également de mettre à jour des sous documents en une seule opération. Le désavantage de l'embarqué, c'est lorsqu'on veut accéder aux sous-documents sans passer par les documents parents.
Ce que recommande MongoDB, c'est d'embarquer les documents (dénormaliser) dès qu'il y a une relation d'inclusion (One to One ou One to Many).
Example:
````json
{
    "name": "jean-eude",
    "hobbies": [
        { "priority": 01, "name": "science fiction" },
        { "priority": 04, "name": "handball" },
        { "priority": 10, "name": "video game" },
    ],
    "year": "1850",
    "address": {
        "street": "1 avenue du Général",
        "zipCode": "77777",
        "state": "France"
    }
}
````
Et d'utiliser des références (normaliser) lorsqu'on souhaite représenter des relations many-to-many que l'on ne veut pas dupliquer, et que la hiérarchie des données est importante.

Ces recommandations sont générales et ne s'appliquent pas à tous les cas. Nous allons voir différentes possibilitées de modéliser du one-to-many.

## Example de modélisation One-to-Many
--> montrer des examples visuels + requete pour accéder aux données d'un côté et de l'autre + indice de performance.

Si on accède fréquemment qu'à une partie du document, on peut envisager de mettre l'autre partie dans un autre document, surtout si celle ci est volumineuse. Cela évitera d'occuper plus de mémoire vive que nécessaire lors de la récupération de ce document.

On ne modélisera pas de la même manière si c'est du one-to-[pas beaucoup] que si c'est du one-to-zillion
Par exemple pour modéliser un produit et ses composants, on pourrait avoir un tableau de référence. Cela a l'avantage de chercher et manipuler les composants plus simplement car découplé du parent. Et cela permet d'avoir d'autres produits référencer les mêmes composants.

Pour du one-to-zillion, un tableau de référence dépasserait la limite des 16Mo par document. Dans ce cas, on pourrait stocker la référence du produit dans chaque composant. Cela a également l'avantage de pouvoir accéder au produit qui utilise un certain composant plus efficacement.

Il est également possible de combiner les deux technique, en gardant une référence des deux côtés. L'inconvéniant est qu'une mise à jour de relation sera plus couteuse, vu qu'il faudra modifier à trois endroits différents.

Si on connait à l'avance les requêtes qui seront frequement faites, on peut aussi dénormaliser en incluant des informations de l'un des documents dans l'autre. Ça à l'avantage d'avoir accès à l'information en une seule requête. Mais la encore, ça complique les mise à jour d'information.

MongoDB a mis à disposition un nouveau moteur de stockage, en passant de MMAPv1 à WiredTiger. Et avec ce nouveau moteur, il n'y a plus de mise à jour sur place de document. C'est à dire qu'avant, il fallait faire attention lors de notre modélisation à ce qu'un document ne grossisent pas trop souvent en taille, pour éviter des réallocation. Maintenant, à chaque mise à jour, il y a toujours une nouvelle réécriture. Au moins c'est plus simple.

## Quelles sont les limites vis-à-vis des collections ?

Il peut être intéressant de stocker des documents à première vu similaire dans des collections séparés, pour avoir de meilleures performances.
Par example pour le stockage de logs, avoir une collection par type d'environement (dev, debug, etc...) sera plus efficace que de tout mettre dans une collection "log". Surtout qu'il n'y a pas de surcoût a créer de nouvelle collections.

Dans le cas où on a une collection avec beaucoup de petit documents, si la logique le permet, il vaut mieux essayer de les embarquer.
Ex avec des logs
Cela permettrait de mettre en commun des propriétés, et lorsqu'on les récupère par groupe, d'avoir des meilleures performances.
