Au cours du développement de nos projets, on peut se retrouver à écrire du comportement générique, susceptible d'être réutilisé autre part. Mais on est peut être en train de réinventer la roue si ce comportement est déjà distribué publiquement... Si ce n'est pas le cas, on pourrait être tenté de le mettre à disposition.
Nous allons voir ensemble la procédure et les bonnes pratiques de publication d'une bibliothèque Open Source écrit en TypeScript.

## Packager notre projet pour NPM
Cette partie va répondre à "Que fournissons-nous à l'utilisateur". Pour éviter que le `node_module` de nos utilisateurs se transforme en monstre, il faut rester soucieux de n'embarquer que le nécessaire :
 - le package.json
 - les fichiers transpilés, minimifié et sans source-map
 - les types

Pour cacher le superflus de NPM, créons un fichier `.npmignore` et mettons-y :
  - les sources TypeScript
  - les fichiers de config
  - les tests
  - la doc
Sans ce fichier, NPM va par défaut se calquer sur le `.gitignore`, mais les deux usages étant vraiment séparés, ça ne suffira pas. À noter aussi que certains fichiers sont ignorés implicitement, tel que node_modules.

### Tester son packaging localement

## Votre projet sur NPM
Si vous n'avez pas de compte NPM, il va être temps d'en créer un ! Ensuite vous aurez le choix de publier directement via ce compte ou via une organisation rattaché à ce compte. Publier via une organisation permet d'avoir des packages NPM scopés, et de les regrouper (comme avec @angular par exemple).