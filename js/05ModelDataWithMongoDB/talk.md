# Plan
- Petite présentation holistique de MongoDB
- Le contexte du processus décisionnel du design de donnée
  - Son expressivité schématique
  - Ses capacités de recherche
  - Ses mécanismes de gestion de la durabilité
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

## Les capacités de recherche


