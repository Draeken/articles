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

```json
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
```

_Un document utilisateur_

Ici, les adresses sont des documents spécifiques à l'utilisateur. Ça ne ferait pas sens d'y accéder sans passer en premier lieu par lui. Elles sont également peu nombreuses, donc les embarquer est le choix idéal.

Pour afficher les adresses d'un utilisateur donné : soit on les récupères en même temps que l'utilisateur, soit, à partir de l'id :

```shell
db.users.findOne({ _id: ObjectId("5c35c49e80951734b243ab3c")}, { address: 1 })
```

Cela nous donne :

```json
{
  "_id": ObjectId("5c35c49e80951734b243ab3c"),
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
```

Si nous avions d'autres besoins, comme par exemple afficher les pays où nous avons le plus d'utilisateurs, la requête serait un peu plus complexe :

```shell
db.users.aggregate([
  { $project: { address: { country: 1 } } },
  { $unwind: "$address" },
  { $group: { _id: "$address.country", totalPop: { $sum: 1}}},
  { $sort: { totalPop: -1 }},
  { $limit: 10 }
]);
```

\$project va nous garder uniquement, pour chaque utilisateur, la liste de ses pays de résidence.
Example pour un utilisateur :

```json
{
  "_id": ObjectId("5c3b543484a1ba3e7e28cb01"),
  "address": [
    { "country": "Guadeloupe" },
    { "country": "Chad" },
    { "country": "Guadeloupe" }
  ]
}
```

\$unwind va transformer une ligne de résultat ayant N adresses en N lignes avec une seul adresse.

```json
{ "_id" : ObjectId("5c3b543484a1ba3e7e28cb01"), "address" : { "country" : "Guadeloupe" } }
{ "_id" : ObjectId("5c3b543484a1ba3e7e28cb01"), "address" : { "country" : "Chad" } }
{ "_id" : ObjectId("5c3b543484a1ba3e7e28cb01"), "address" : { "country" : "Guadeloupe" } }
```

$group et $sum vont regrouper toutes les lignes ayant le même pays et sommer leur nombre.

```json
{ "_id" : "Chad", "totalPop" : 1 }
{ "_id" : "Guadeloupe", "totalPop" : 2 }
```

Cela nous donne :

```json
{ "_id" : "Congo", "totalPop" : 32 }
{ "_id" : "Korea", "totalPop" : 23 }
{ "_id" : "Cayman Islands", "totalPop" : 23 }
{ "_id" : "British Virgin Islands", "totalPop" : 21 }
{ "_id" : "Swaziland", "totalPop" : 21 }
{ "_id" : "Saint Martin", "totalPop" : 20 }
{ "_id" : "United Arab Emirates", "totalPop" : 20 }
{ "_id" : "Tonga", "totalPop" : 19 }
{ "_id" : "Japan", "totalPop" : 19 }
{ "_id" : "Cambodia", "totalPop" : 19 }
```

Avoir ce résultat précis implique un scan de collection et le modèle actuel n'est pas adapté pour des requêtes fréquentes. On pourrait envisager d'avoir une collection de pays en maintenant le nombre d'utilisateur à jour, mais ça impliquerait deux requêtes lors d'un ajout ou d'une maj d'utilisateur. À nous de voir le compromis que nous souhaitons faire...

Voyons le cas où pour chaque utilisateur, nous avons des rapports générés sur son activité.
On pourrait être tenté d'embarquer ces rapports avec l'utilisateur, vu qu'on y accédera que par son intermédiaire.

```json
{
  "_id": ObjectId("5c35c49e80951734b243ab3c"),
  "name": "Zola Torp",
  "birthDate": ISODate("1997-04-02T22:41:50Z"),
  "activityLogs": [
    {
      "date": ISODate("2018-05-03T21:42:51Z"),
      "type": 5,
      "value": 42
    },
    {
      "date": ISODate("2018-05-03T23:12:55Z"),
      "type": 4
    }
  ]
}
```

_Un document utilisateur avec des rapports d'activités_

Mais avec MongoDB, le document pourrait dépasser la limite des 16 Mo ! Il est possible de contourner cette limite de 16 Mo avec GridFS, qui va découper les documents en morceaux de 255 Ko et les enregistrer dans deux collections distinctes : une pour les metadata et l'autre pour les données binaires. Ça a bien sûr un coût en performance, et en général, mieux vaut changer sa modélisation. À noter que cette limite est propre a MongoDB, par exemple, pour CosmosDB de Microsoft, c'est 2 Mo, mais pour CouchDB, c'est 4 Go. Il faut prendre en compte que le document devra tenir dans la mémoire vive.
Pour notre cas, il serait possible de le gérer en simulant une capped collection - MongoDB propose des Capped Collection ayant une longueur maximale, en supprimant les anciens documents pour faire place aux nouveaux. Avec l'opérateur $slice, utilisé lors d'un $push, vous pouvez demander à ne garder que les N derniers sous documents.

```shell
db.users.update(
  { _id: ObjectId("5c35c49e80951734b243ab3c") },
  {
    $push: {
      activityLogs: {
        $each: [{
          "date": ISODate("2018-05-04T08:42:51Z"),
          "type": 6,
          "value": 2395
        }],
        $slice: -500
      }
    }
  }
)
```

Avec cette commande, nous ajoutons un nouveau journal d'activité en nous assurant de limiter leur nombre aux 500 derniers.

Si l'on doit garder un nombre de rapport tel que le poids du document racine devenait inaceptable, il faudrait recourir à l'autre grande stratégie : utiliser des références plutôt qu'embarquer directement le document.
Ainsi, nous rassemblons tous les rapports d'activités de chaque utilisateur dans une collection dédiée, et nous rajoutons un tableau de références dans le schéma de l'utilisateur. Les références de MongoDB utilisent 12 octets, ce qui est souvent bien inférieur au poids d'un sous-document. Avec cette stratégie, le schema de l'utilisateur pourra référencer un peu plus de 1 350 000 rapports !

```json
{
	"_id" : ObjectId("5c405f1dfbb0eafdb4f1aa25"),
	"name" : "Koby Johnson",
	"birthDate" : ISODate("1990-04-09T15:54:38Z"),
	"activityLog" : [
		ObjectId("5c405f1d94b5e322c292cc67"),
		ObjectId("5c405f1d94b5e322c292cc68"),
		ObjectId("5c405f1d94b5e322c292cc69")
  ]
}
```
_Un document utilisateur avec des rapports d'activités référencés_


```json
{
	"_id": ObjectId("5c405f1d94b5e322c292cc67"),
	"type": 18,
  "date": ISODate("2018-04-09T15:54:38Z"),
  "value": 54896324
}
```
_Un rapport d'activité dans une collection distincte_

Pour récupérer les derniers rapports d'un utilisateur, nous aurions juste à faire :

```shell
db.activityLogs.find({
  _id: { $in: myUser.activityLog }
})
```

Cependant avec ce système, nous nous retrouvons avec une seule grosse collection de journaux d'activité, qui risque de prendre des proportions énormes rapidement. Bien sûr il est possible de poser une limite au nombre de document via les Capped-Collection, comme nous avons vu, ou bien mettre un index TTL. Les index TTL (Time To Live) permettent de supprimer automatiquement des documents d'une collection lorsqu'ils arrivent à expiration. Par exemple sur un document ayant un champ `lastModifiedDate`, on peut parametrer l'index TTL pour supprimer ce document lors que cette date est dépassée d'une heure. Dans notre exemple, le fait de tout mettre dans une même collection nous fait perdre en flexibilité car tous les documents seraient traités de la même manière. Si nous traitons différemment nos journaux en fonction de leur type ou priorité, on pourrait ranger chaque document dans une collection dédié à un type/priorité et avoir des propriétés différentes pour ces collections.

Si toute fois ce n'est toujours pas suffisant, il reste un dernier recours avant de passer à GridFS : garder la référence côté rapport et non côté utilisateur. Et pour ne pas faire une collection scan (analyser l'ensemble de la collection pour répondre à une requête) lorsqu'on veut récupérer tous les rapports d'un utilisateur, on peut simplement construire un index sur le champ du rapport référençant l'utilisateur.
Dans le cas où les documents ne sont pas embarqués, on peut dénormaliser certaines données fréquement recherchées pour éviter des lookup (le fait d'aller chercher le document dont on a seulement la référence). Dans notre exemple d'utilisateur ayant des rapports d'activités, prenons le cas où notre application doit afficher en diagramme la répartition des types de rapport pour un utilisateur donné et où l'utilsateur a un tableau de référence de rapports. Sans dénormalisation, il faudrait récupérer chaque document via sa référence (via un \$lookup), puis agréger les types en quantité.

-- Comment savoir la taille d'un fichier embarqué estimer le nombre max de ce type de fichier embarquable ?

NB:
MongoDB a mis à disposition un nouveau moteur de stockage, en passant de MMAPv1 à WiredTiger. Et avec ce nouveau moteur, il n'y a plus de mise à jour sur place de document. C'est à dire qu'avant, il fallait faire attention lors de notre modélisation à ce qu'un document ne grossisent pas trop souvent en taille, pour éviter des réallocation. Maintenant, à chaque mise à jour, il y a toujours une nouvelle réécriture. Au moins c'est plus simple.
