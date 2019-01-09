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
Par exemple, si l'on veut enregistrer les différentes adresses d'un utilisateur, pour lui proposer ensuite une adresse de livraison, on aura à priori aucune raison de ne pas les embarquer avec l'utilisateur.
````json
{
  "_id": ObjectId("5c35c49e80951734b243ab3c"),
  "name": "Zola Torp",
  "birthDate": ISODate("1997-04-02T22:41:50Z"),
  "address": [
    {
      "name": "mclaughlin.info",
      "country": "Trinidad and Tobago",
      "city": "Morarside"
    },
    {
      "name": "ledner.net",
      "country": "British Virgin Islands",
      "city": "Monteburgh"
    },
    {
      "name": "emmerich.name",
      "country": "Brunei Darussalam",
      "city": "Kaylinhaven"
    }
  ]
}
````
_Un document utilisateur_

Ici, les adresses sont des documents spécifiques à l'utilisateur. Ça ne ferait pas sens d'y accéder sans passer en premier lieu par lui. Elles sont également peu nombreuses, donc les embarquer est le choix idéal.

Pour afficher les adresses d'un utilisateur donné:


En revanche, si pour chaque utilisateur on a des rapports générés sur son activité, il faut faire attention :
en embarquant tous ces rapports directement avec l'utilisateur, le document pourrait dépasser la limite des 16 Mo ! Il est possible de contourner cette limite des 16 Mo avec GridFS, qui va découper les documents en morceaux de 255 Ko et les enregistrer dans deux collections distinctes : une pour les metadata et l'autre pour les données binaires. Ça a bien sûr un coût en performance, et en général, mieux vaut changer sa modélisation.
Pour ce cas la, il serait possible de le gérer en simulant une capped collection - MongoDB propose des Capped Collection ayant une taille maximale, en supprimant les anciens documents pour faire place aux nouveaux. Avec l'opérateur $slice, utilisé lors d'un $push, vous pouvez demander à ne garder que les N derniers sous documents.
Dans notre exemple, si l'on doit garder un nombre de rapport tel que le poids du document racine devient inaceptable, il faudra recourir à l'autre grande stratégie : utiliser des références plutôt qu'embarquer directement le document.
Ainsi, nous rassemblons tous les rapports d'activités de chaque utilisateur dans une collection dédiée, et nous rajoutons un tableau de références dans le schéma de l'utilisateur. Les références de MongoDB utilisent 12 octets, ce qui est souvent bien inférieur au poids d'un sous-document. Avec cette stratégie, le schema de l'utilisateur pourra référencer un peu plus de 1 350 000 rapports !
Si toute fois ce n'est toujours pas suffisant, il reste un dernier recours avant de passer à GridFS : garder la référence côté rapport et non côté utilisateur. Et pour ne pas faire une collection scan (analyser l'ensemble de la collection pour répondre à une requête) lorsqu'on veut récupérer tous les rapports d'un utilisateur, on peut simplement construire un index sur le champ du rapport référençant l'utilisateur.
Dans le cas où les documents ne sont pas embarqués, on peut dénormaliser certaines données fréquement recherchées pour éviter des lookup (le fait d'aller chercher le document dont on a seulement la référence). Dans notre exemple d'utilisateur ayant des rapports d'activités, prenons le cas où notre application doit afficher en diagramme la répartition des types de rapport pour un utilisateur donné et où l'utilsateur a un tableau de référence de rapports. Sans dénormalisation, il faudrait récupérer chaque document via sa référence (via un $lookup), puis agréger les types en quantité.

-- Comment savoir la taille d'un fichier embarqué estimer le nombre max de ce type de fichier embarquable ?

NB:
MongoDB a mis à disposition un nouveau moteur de stockage, en passant de MMAPv1 à WiredTiger. Et avec ce nouveau moteur, il n'y a plus de mise à jour sur place de document. C'est à dire qu'avant, il fallait faire attention lors de notre modélisation à ce qu'un document ne grossisent pas trop souvent en taille, pour éviter des réallocation. Maintenant, à chaque mise à jour, il y a toujours une nouvelle réécriture. Au moins c'est plus simple.
