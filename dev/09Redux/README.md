- How Redux works
- When should you use it?
- How to use Redux
- How to use it with TypeScript
- What are common plug-ins ? Thunk? How does they works

## How Redux Works
Tout l'état de l'application est contenu dans un seul objet - le store. Afin de le modifier, il faut nécessairement émettre une action, qui est traitée par un réducer.
Principes :
- unique source de vérité : le store
- l'état est en lecture seule
- les changements sont fait via des fonctions pures (pas de logique asynchrone, pas de valeurs aléatoires ni d'autre effet de bord)

Le store ne peut contenir que des objets, tableaux et valeurs primitives - tout ce qui peut être serialisable. Cela exclut fonctions et instances (comme un objet Date).

Il est préférable d'avoir le plus de logique "métier" dans les réducers plutôt qu'avant le déclenchement des actions. Les actions doivent être les plus petites/atomiques possibles.

Les middlewares permettent de gérer d'autres cas, en gardant la logique éloignée de l'UI.

## When you should use it?
Vérifier que les contraintes liée à Redux en vaille la peine. C'est généralement le cas dans le cas ou on conçoit une app avec un état important, beaucoup d'interactions entre différentes parties de l'app, ou l'on souhaite sauvegarder l'état de l'app ou pouvoir rejouer des évenements.
Dans tous les cas, l'état propre à un composant, qui n'est utilisé nul part ailleurs et n'a pas besoin d'être synchronisé doit rester local.

## How to use Redux
Avoir un reducer pour chaque partie distincte.
Le terme "slice" designe un reducer et ses actions associées, correspondant à une partie distincte de l'état.
Possibilité d'utilsier `createSlice`/`createReducer` (venant de Redux ToolKit, qui utilise Immer en interne) pour retourner une copie modifiée de l'état sans toute la complexité visuelle des spread operators.
Pour fournir le store à une app React, on utilise les hooks `useSelector` qui cible une partie de l'état général et `useDispatch` pour déclencher des actions. Le provider se trouve à la racine de l'app. Le composant utilisant `useSelector` sera ré-évalué à chaque fois que `useSelector` retourne une nouvelle référence.
Lorsqu'on a besoin d'une valeur aléatoire (eg: id unique), il est nécessaire de le générer en amont et de le passer en payload à l'action. Ce cas est géré via la propriété `prepare` d'un réducer donné à `createSlice`.

Le thunk est une fonction créant une action asynchrone, prenant `dispatch` et `getState` en paramètre. Il est d'usage que le thunk dispatch dès son appel une action indicant le démarrage de l'action asynchrone (-> état de chargement, avoir un retour côté UI, prévoir le succès. On pourrait placer une propriété "status" à côté de ce qu'on met à jour, avec les options "pending", "idle", "complete" et "error" - cela est fait automatiquement via `createAsyncThunk`), puis en fonction du retour asynchrone, déclencher une action de réussite ou d'erreur. Le workflow est le suivant : status idle -> dans le composant, si "idle" on dispatch une thunk action fetchData -> status pending -> affichage du loader dans le composant -> en fonction du status "complete" ou "error", afficher le résultat ou le message d'erreur.

## How to use it with TypeScript
If you're using TypeScript, you should use the builder callback form of extraReducers.