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
# Mise en contexte

## L'essors du NoSQL et des document-based DB

Pourquoi le NoSQL s'est développé ?

- répondre aux besoins d'un nombre grandissant d'utilisateur, en gardant une latence faible, en scalant horizontalement.
- s'adapter rapidement aux changement business, en étant moins figé sur un schéma de base
- être plus accessible: plus simple a utiliser et aussi en terme de coût de licence, vu que beaucoup sont open-source.

Les premiers systèmes NoSQL n'était pas strictement conformes avec les propriétés ACID. Mais les systèmes NoSQL ont progressés et peuvent maintenant garantir ces propriétés dans une majorité des cas.

## Que sont et où se situent les document-based DB

On trouvera plusieurs type de base NoSQL, pour chaque type de besoin.
Par exemple, pour savoir le nom du film sur les sous-marins avec l'acteur qui à joué dans un autre film avec un autre acteur qui a joué le chef dans Gone With the Wind", on pourra utiliser une base orienté Graph, comme Neo4j. Pour gérer son système de cache, ou le moteur n'a pas besoin de connaitre la structure de nos données, on pourra utiliser une simple base orienté clef-valeur, comme Redis. Pour les bases orientés documents, la donnée n'est pas opaque et on peut opérer dessus avec de bonnnes performances, ce qui en fait une bonne candidate par défaut.
Dans les bases orienté documents, la donnée est stockée sous forme d'objet, qui a la même forme qu'un objet JSON.
Selon les implémentations, les documents peuvent être organisés dans des collections, comme c'est le cas de MongoDB, ou dans une structure d'arbre, ou bien juste tagués, avec des métadonnées extérieures au document.
La solution la plus utilisée étant MongoDB.

# Petite présentation holistique de MongoDB

_Schema montrant Mongo au milieu des autres SGBD_
A l'époque ou MongoDB est en train d'être créé, il y a très peu de NoSQL (CouchDB et BigTable sont sorti en 2005).
Lors du design, l'objectif était d'optimiser l'accessibilié des donnéees, et non l'espace disque utilisé comme à l'origine avec les SGBD. Le tout en respectant les propriétés ACID au niveau document. MongoDB sort finalement en 2009, sous license OpenSource, écrit en C, C++ & JS.
On a la hierarchie suivante:
_Schema sur la hierarchie des artéfacts de MongoDB : DB, Collection, Document [, EmbededDocument, EmbededDocument bis (etc...x100)]_
Les EmbededDocuments sont parti intégrante du document et...Peut on vraiment les considérer comme un sous niveau de la hiérarchie ? La liaison est plus forte qu'entre DB & Collection & Document

# Le contexte du processus décisionnel du design de donnée

-> [article.md](./article.md)