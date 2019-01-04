# Modéliser sa donnée avec MongoDB

Cet article va vous présenter différentes manières de modéliser sa donnée avec les implications sur les performances, et dans quel cas préférer un design à un autre. Ce n'est pas une introduction à MongoDB, donc un minimum de connaissance sur son fonctionnement est préferable.

## Considérations

En général, la question que l'on va se poser lorsqu'on modélise pour MongoDB, c'est: est-ce que j'utilise des références, ou est-ce que j'intègre directement ?
Qu'est-ce que cela va changer ?
Avec les sous documents embarqués, on a des meilleures performances de lecture, car il n'y a pas d'opération supplémentaire pour récupérer la donnée référencée. En une seule requête on peut récupérer le document et tous ces sous-documents. Et cela permet également de mettre à jour des sous documents en une seule opération. Le désavantage de l'embarqué, c'est lorsqu'on veut accéder aux sous-documents sans passer par les documents parents. Cela duplique également la donnée dans le cas du many-to-many.
Ce que recommande MongoDB, c'est d'embarquer les documents (dénormaliser) dès qu'il y a une relation d'inclusion (One to One ou One to Many).

Ces recommandations sont générales et ne s'appliquent pas à tous les cas. Nous allons voir différentes possibilitées de modéliser du one-to-many.

## Modélisation du One-to-Many

Le cas le plus simple : on embarque les sous documents. C'est le choix par défaut.
Par exemple, si l'on veut enregistrer les différentes addresses d'un utilisateur, on aura aucune raison de ne pas les embarqués avec l'utilisateur.
En revanche, si pour chaque utilisateur on a des rapports générés sur son activité, il faut faire attention :
en embarquant tous ces rapports directement avec l'utilisateur, le document pourrait dépasser la limite des 16 Mo ! Il est possible de contourner cette limite des 16 Mo avec GridFS, qui va découper les documents en morceaux de 255 Ko et les enregistrer dans deux collections distinctes : une pour les metadata et l'autre pour les données binaires. Ça a bien sûr un coût en performance, et en général, mieux vaut changer sa modélisation.
Pour ce cas la, il serait possible de le gérer en simulant une capped collection - MongoDB propose des Capped Collection ayant une taille maximale, en supprimant les anciens documents pour faire place aux nouveaux. Avec l'opérateur $slice, utilisé lors d'un $push, vous pouvez demander à ne garder que les N derniers sous documents.
Dans notre exemple, si l'on doit garder un nombre de rapport tel que le poids du document racine devient inaceptable, il faudra recourir à l'autre grande stratégie : utiliser des références plutôt qu'embarquer directement le document.
Ainsi, nous rassemblons tous les rapports d'activités de chaque utilisateur dans une collection dédiée, et nous rajoutons un tableau de références dans le schéma de l'utilisateur. Les références de MongoDB utilisent 12 octets, ce qui est souvent bien inférieur au poids d'un sous-document. Avec cette stratégie, le schema de l'utilisateur pourra référencer un peu plus de 1 350 000 rapports !
Si toute fois ce n'est toujours pas suffisant, il reste un dernier recours avant de passer à GridFS : garder la référence côté rapport et non côté utilisateur. Et pour ne pas faire une collection scan (analyser l'ensemble de la collection pour répondre à une requête) lorsqu'on veut récupérer tous les rapports d'un utilisateur, on peut simplement construire un index sur le champ du rapport référençant l'utilisateur.


-- Comment savoir la taille d'un fichier embarqué estimer le nombre max de ce type de fichier embarcable ?

Si on accède fréquemment qu'à une partie du document, on peut envisager de mettre l'autre partie dans un autre document, surtout si celle ci est volumineuse. Cela évitera d'occuper plus de mémoire vive que nécessaire lors de la récupération de ce document.

On ne modélisera pas de la même manière si c'est du one-to-[pas beaucoup] que si c'est du one-to-zillion
Par exemple pour modéliser un produit et ses composants, on pourrait avoir un tableau de référence. Cela a l'avantage de chercher et manipuler les composants plus simplement car découplé du parent. Et cela permet d'avoir d'autres produits référencer les mêmes composants.

Pour du one-to-zillion, un tableau de référence dépasserait la limite des 16Mo par document. Dans ce cas, on pourrait stocker la référence du produit dans chaque composant. Cela a également l'avantage de pouvoir accéder au produit qui utilise un certain composant plus efficacement.

Il est également possible de combiner les deux technique, en gardant une référence des deux côtés. L'inconvéniant est qu'une mise à jour de relation sera plus couteuse, vu qu'il faudra modifier à trois endroits différents.

Si on connait à l'avance les requêtes qui seront frequement faites, on peut aussi dénormaliser en incluant des informations de l'un des documents dans l'autre. Ça à l'avantage d'avoir accès à l'information en une seule requête. Mais la encore, ça complique les mise à jour d'information.

NB:
MongoDB a mis à disposition un nouveau moteur de stockage, en passant de MMAPv1 à WiredTiger. Et avec ce nouveau moteur, il n'y a plus de mise à jour sur place de document. C'est à dire qu'avant, il fallait faire attention lors de notre modélisation à ce qu'un document ne grossisent pas trop souvent en taille, pour éviter des réallocation. Maintenant, à chaque mise à jour, il y a toujours une nouvelle réécriture. Au moins c'est plus simple.
