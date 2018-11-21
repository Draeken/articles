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
Mongo est un NoSQL. C'est à dire qu'il va s'astreindre des contraintes trop rigides des SGBD classiques pour pouvoir garder de bonne performances en montant en volume. De plus il est orienté document, cela signifie qu'il stocke la donnée sous forme d'objet, qui a la même forme qu'un objet JSON, dans des collections. La forme de l'objet n'est pas stricte et on peut avoir des objets de forme différentes dans la même collection.
On a la hierarchie suivante:
_Schema sur la hierarchie des artéfacts de MongoDB : DB, Collection, Document, EmbededDocument, EmbededDocument bis (etc...x100)_

