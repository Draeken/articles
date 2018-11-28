# Plan
- Petite présentation holistique de MongoDB
- Le contexte du processus décisionnel du design de donnée
  - Son expressivité schématique
  - Ses capacités de recherche
- Modélisation de la donnée
  - Considération
  - Exemples
    - Logs
    - Aggretations

# Petite présentation holistique de MongoDB

_Schema montrant Mongo au milieu des autres SGBD_
En 2007, trois anciens de la Silicon Valley fonde une entreprise de plateforme as a service, mais ne trouvant aucun sgbd respectant leurs principes pour une architecture dans le Cloud, décident de créer le leur. À cette époque, il y a très peu de NoSQL (CouchDB et BigTable sorti en 2005). Ils sortent MongoDB en 2009, sous license OpenSource, écrit en C, C++ & JS. Il est de type NoSQL. C'est à dire qu'il va s'astreindre des contraintes trop rigides des SGBD classiques pour pouvoir garder de bonne performances en montant en volume. De plus il est orienté document, cela signifie qu'il stocke la donnée sous forme d'objet, qui a la même forme qu'un objet JSON, dans des collections. La forme de l'objet n'est pas stricte et on peut avoir des objets de forme différentes dans la même collection.
On a la hierarchie suivante:
_Schema sur la hierarchie des artéfacts de MongoDB : DB, Collection, Document [, EmbededDocument, EmbededDocument bis (etc...x100)]_
Les EmbededDocuments sont parti intégrante du document et...Peut on vraiment les considérer comme un sous niveau de la hiérarchie ? La liaison est plus forte qu'entre DB & Collection & Document
L'entreprise abandonne son projet de plateforme as as service pour se concentre sur MongoDB.

# Le contexte du processus décisionnel du design de donnée

Lorsque l'on chercher à modéliser ses données, la difficulté est de trouver l'équilibre entre les besoins de l'application, les performances liés au moteur et les moyens d'accès à ces données. Nous allons commencer par voir ces deux derniers points.

## L'expressivité schématique

Les documents de mongoDB respectent le format BSON, pour Binary JSON. C'est un format qui binairifie le JSON. La version binaire reste légère et rapide a encoder/décoder, mais n'est pas forcément plus légère que sa version JSON. En fait la version binaire rajoute des informations comme la taille des chaine de caractères ou des sous-objets, pour permettre de traverser le JSON plus efficacement. Le BSON permet également d'avoir d'autres types de valeur, comme Date ou BinaryData. MongoDB apporte lui aussi une surcouche avec ses propres types, comme le GeoJSON pour gérer les requêtes géospatiales.
Et comme avec le JSON, on peut retrouver dans nos documents des sous documents, et des tableaux de sous documents. Il y a une limite de profondeur à 100 niveaux de sous documents.
Et chaque document est limité a 16 Mo.

## Les capacités de recherche

# Modélisation de la donnée

## Considérations

En général, la question que l'on va se poser lorsqu'on modélise pour MongoDB, c'est: est-ce que j'utilise des références, ou est-ce que j'intègre directement ?
Qu'est-ce que ça va changer ?
Avec les sous documents embarqués, on a des meilleures performances de lecture, car on a pas à récupérer la donnée référencée. En une seule requête on peut récupérer le document et tous ces sous-documents. Et cela permet également de mettre à jour des sous documents en une seule opération.
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

## Quelles sont les limites vis-à-vis des collections ?

Il peut être intéressant de stocker des documents à première vu similaire dans des collections séparés, pour avoir de meilleures performances.
Par example pour le stockage de logs, avoir une collection par type d'environement (dev, debug, etc...) sera plus efficace que de tout mettre dans une collection "log". Surtout qu'il n'y a pas de surcoût a créer de nouvelle collections.

Dans le cas où on a une collection avec beaucoup de petit documents, si la logique le permet, il vaut mieux essayer de les embarquer.
Ex avec des logs
Cela permettrait de mettre en commun des propriétés, et lorsqu'on les récupère par groupe, d'avoir des meilleures performances.
