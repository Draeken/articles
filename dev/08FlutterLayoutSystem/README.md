# Flutter Layout System
## Questions
How Flutter Layout works
Layout rules
How common widgets act in this system
Common Pitfalls/How to debug

## How Flutter Layout works

[x] https://flutter.dev/docs/development/ui/layout
[x] https://flutter.dev/docs/development/ui/layout/constraints
[x] https://flutter.dev/docs/resources/inside-flutter

Dans Flutter, tout est widget, y compris la mise en page. Basiquement, on construit une mise en page en assemblant des widgets responsables d'organiser visuellement leurs enfants. Flutter met à disposition de nombreux widgets de mise en page, couvrant tous les cas généraux (organisation en ligne, colonne, grille, etc...).
(L'algorithme de mise en page vise une performance sous-linéaire, et est exécuté une fois par frame.) Un widget qui calcul sa mise en page appel l'algorithme de tout ses enfants en donnant ses contraintes. Ensuite, il fait remonté sa géométrie à son parent, ce qui lui permet à son tour de calculer sa géométrie. C'est aussi à ce moment la que le parent positionne l'enfant par rapport à son propre espace. Pour atteindre cette bonne performance, il n'y a pas de renvoies entre un widget parent et enfant : tout se décide en une passe.
Dans le cas d'un widget sliver, c'est différent. Les enfants de sliver peuvent s'étendrent au delà la taille du widget parent. Donc en plus des contraintes habituelles, des informations sur la portion visible (viewport) sont données aux enfants.

## Layout Rules
Ormis la règle générale "Les contraintes descendent; les tailles remontent; les parents décident de la taille", il y a quelques règles à respecter pour ne pas générer d'erreurs. Il s'agit soit d'erreurs lié à une taille infinie, soit une taille plus grande que le containeur dans lequel cela doit s'afficher :
- le cas ou un enfant demande une taille infinie à un parent non contraignant
- pour certains widget comme `FittedBox`, impossible d'avoir un enfant demandant une taille infinie
- un enfant demande une taille plus grande qu'un containeur parent, ayant comme intermédiaire un parent non contraignant
Les widgets les plus connus étant non contraignant sont les `flex boxes` (`Row` ou `Column`) et les slivers (`ListView` ou `ScrollView`).

## How common widgets act in this system
Pour savoir comment un widget va se comporter dans le système de mise en page, deux solutions :
- lire la doc du widget (recommandé)
- étudier son code source : `createRenderObject()` -> `performLayout()`
Dans tous les cas, il est peu probable de bien deviner son comportement en se fiant seulement à son nom.

### Dans un contexte contraignant
Center, Align voudront être aussi grand que possible.
### Dans un contexte non contraignant
Center, Align prendront la taille de leur enfant (ou plus si spécifié).
### Dans un context Flex (Row/Column)
Expanded : permet à l'enfant de prendre la place restante le long de l'axe principale
Spacer : permet de prendre de la place (comme un Expanded avec un enfant vide).

https://flutter.dev/docs/development/ui/widgets/layout

## Common Pitfalls/How to debug
https://flutter.dev/docs/development/tools/devtools/inspector

