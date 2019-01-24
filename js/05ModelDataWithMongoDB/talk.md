Je vais vous présenter les bases NoSQL orientés document, et comment modéliser efficacement ses données avec MongoDB, la plus populaire d'entre elles.

## L'essors du NoSQL et des document-based DB

Pourquoi le NoSQL s'est développé ?
Dans les années 2000, le SQL convenait très bien: on upgrade la machine proportionnellement à la quantité de données stoquées et a la fréquence des requêtes. Le business est stable et peut faire ses analyses grâce à une hierarchie bien ficelé.

> user -> emoji machine -> success
> (2x)user -> (scaled up) emoji machine -> success
> (businessman + random emoji (one feature) ) -> dev -> happy

Bon, avec les nouveaux besoins, ça se complexifie assez vite et il faudra une bonne expertise pour déméler tout ça. Au bout d'un moment, les performances deviennent médiocres et on doit faire appel à une équipe envoyé par Oracle pour trouver une solution. En même temps, ça devient compliqué d'upgrader la machine pour supporter toutes ces requêtes...

> (100x)user -> (scaled up) emoji machine + ramble (/hazard) -> timer/sandglass/hourglass
> (businessman + (50x random emoji (50 feature) ) -> dev -> madness
> (rescue dev team from businessman) -> money

C'est la qu'on voit apparaitre le développement d'un nouveau type de base, favorisant la disponibilité à l'espace de stockage, permettant de scaler horizontalement et de garder de bonnes performances avec un nombre très important de données et de requêtes.
De s'adapter rapidement aux changements business, en étant moins figé sur un schéma de base
Et d'être plus accessible: plus simple a utiliser et aussi en terme de coût de licence, vu que beaucoup de NoSQL sont open-source.

> (100x)user -> (20x)emoji machine -> success
> (businessman + (50x random emoji (50 feature) ) -> dev -> triumph

## Que sont et où se situent les document-based DB

On trouvera plusieurs type de base NoSQL, pour chaque type de besoin.
> blank slide with title

Par exemple, pour savoir le nom du film sur les sous-marins avec l'acteur qui à joué dans un autre film avec un autre acteur qui a joué le chef dans Gone With the Wind", on pourra utiliser une base orienté Graph, comme Neo4j.
> add to one corner: Neo4j screenshot

Pour gérer son système de cache, ou le moteur n'a pas besoin de connaitre la structure de nos données, on pourra utiliser une simple base orienté clef-valeur, comme Redis.
> add to one corner: redis screenshot

Pour les bases orientés documents, la donnée n'est pas opaque et on peut opérer dessus avec de bonnnes performances, ce qui en fait une bonne candidate par défaut.

> add to one corner: mongodb schema screenshot

Dans les bases orienté documents, la donnée est stockée sous forme d'objet, qui a la même forme qu'un objet JSON.
Selon les implémentations, les documents peuvent être organisés dans des collections, comme c'est le cas de MongoDB, ou dans une structure d'arbre, ou bien juste tagués, avec des métadonnées extérieures au document.
> add to one corner: collection / tree / tags

# Petite présentation holistique de MongoDB

A l'époque ou MongoDB est en train d'être créé, il y a très peu de NoSQL (CouchDB et BigTable sont sorti en 2005).
Lors de son design, les devs ont tenu a respecter les propriétés ACID au niveau document. Ces propriétés n'étaient souvent pas la priorité lors du développement des premières bases NoSQL, c'était plutôt la disponibilité avant tout. MongoDB sort finalement en 2009, sous license OpenSource, écrit en C, C++ & JS.
> partie haute : ACID for document operation, languages, OpenSource logo

On a la hierarchie suivante:
Les EmbededDocuments sont parti intégrante du document et...Peut on vraiment les considérer comme un sous niveau de la hiérarchie ? La liaison est plus forte qu'entre DB & Collection & Document
> partie basse : DB, Collection, Document [, EmbededDocument, EmbededDocument bis (etc...x100)]

# Considération lors du design de donnée

En général, la question que l'on va se poser lorsqu'on modélise pour MongoDB, c'est: est-ce que j'utilise des références, ou est-ce que j'intègre directement ?
Qu'est-ce que cela va changer ?
> schema de design: gauche: embarqué; droite: références, avec exemple de one-to-one, one-to-many, many-to-many
Avec les documents embarqués, on a des meilleures performances de lecture, car il n'y a pas d'opération supplémentaire pour récupérer la donnée référencée. En une seule requête on peut récupérer le document et tous ces sous-documents. Et cela permet également de mettre à jour des sous documents en une seule opération. Le désavantage de l'embarqué, c'est lorsqu'on veut accéder aux sous-documents sans passer par les documents parents. Cela duplique également la donnée dans le cas du many-to-many.
Ce que recommande MongoDB, c'est d'embarquer les documents (dénormaliser) dès qu'il y a une relation d'inclusion (One to One ou One to Many).

Ces recommandations sont générales et ne s'appliquent pas à tous les cas. Nous allons voir différentes possibilitées de modéliser du one-to-many.

## Embarquer peu de document
> slides with json schema, db commands and result; displayed in 3 moves

## Embarquer un nombre important de document
> slide with json format embedded : MongoDB -> normal file system: 16Mo; No limit with GridFS ; couchDB et CosmosDB
> slide about capped collection: educational schema on the right, how to do on the left


## Embarquer un tableau de référence
> slide with schema with array of reference + collection (column) where actual docs are stored. DB command on the bottom

## Garder la référence côté "Many"
> slide with schema with simple user doc + collection (column) where actual docs are stored with link to users. DB command on the bottom

## Optimisation : multiples collections
> slides with giant collection of logs (naive) ; enhanced: capped-collection or TTL indexes ; on the right : explanation on TTL with example.
> giant collection of logs (naive) ; enhanced: multiple collection with TTL/capped ; pros: no limit ; good performance for batch processing

## Optimisation : regrouper les similaires
> slide with a column of lot of small log document (naive); enhanced: one document wich includes others; pros: factorisation, performance for retrieving the whole.

## Optimisation : dénormaliser les champs fréquents
> slide with user referencing logs (naive) ; enhanced: denormalize
> explain how to update ; on the left: transactions limits