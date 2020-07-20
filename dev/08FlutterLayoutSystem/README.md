# Flutter Layout System
## Questions
How Flutter Layout works (100%)
Layout rules (100%)
How common widgets act in this system (25%)
How to debug (30%)
How to create (0%)

## How Flutter Layout works

- [x] https://flutter.dev/docs/development/ui/layout
- [x] https://flutter.dev/docs/development/ui/layout/constraints
- [x] https://flutter.dev/docs/resources/inside-flutter

Dans Flutter, tout est widget, y compris la mise en page. Basiquement, on construit une mise en page en assemblant des widgets responsables d'organiser visuellement leurs enfants. Flutter met à disposition de nombreux widgets de mise en page, couvrant tous les cas généraux (organisation en ligne, colonne, grille, etc...).
(L'algorithme de mise en page vise une performance sous-linéaire, et est exécuté une fois par frame.) Un widget qui souhaite calculer sa mise en page appel l'algorithme de mise en page de tout ses enfants en donnant ses contraintes : ne doit pas être plus large que tant, ou plus haut que tant... Ensuite, il décide de la taille qu'il prendra en respectant les contraintes données par son parent, et s'il a des enfants, les positionne relativement à lui-même, dans son propre espace. Il fait remonté la taille à son parent - uniquement sa taille, pas sa position. Le parent calcul à son tour la taille et la position de ses enfants. Pour atteindre cette bonne performance, il n'y a pas de renvoies entre un widget parent et enfant : tout se décide en une passe.

Dans le cas d'un widget sliver (intégrant un défilement), c'est différent. Les enfants de sliver peuvent s'étendrent au delà la taille du widget parent. Donc en plus des contraintes habituelles, des informations sur la portion visible (viewport) sont données aux enfants.

## Layout Rules
Ormis la règle générale "Les contraintes descendent; les tailles remontent; les parents décident de la position", il y a quelques règles à respecter pour ne pas générer d'erreurs. Il s'agit soit d'erreurs lié à une taille infinie, soit une taille plus grande que le containeur dans lequel cela doit s'afficher :
- le cas ou un enfant demande une taille infinie à un parent non contraignant
- un enfant demande une taille plus grande qu'un containeur parent, ayant comme intermédiaire un parent non contraignant

Dans le premier cas, le projet ne peut pas compiler, tandis que dans le second, en mode dev, un bandeau de mise en garde est affiché.
Il y a aussi des règles spécifiques à certains widgets :
- concernant `FittedBox`, impossible d'avoir un enfant demandant une taille infinie
- la contrainte cross direction d'un flex ne doit pas être non contraignant (la hauteur pour un Row, ou la largeur pour une Column)

Les widgets les plus connus étant non contraignant sont les `flex boxes` (`Row` ou `Column`) avec un shrinkWrap à false et les slivers (`ListView` ou `ScrollView`).

## How common widgets act in this system
Pour savoir comment un widget va se comporter dans le système de mise en page, deux solutions :
- lire la doc du widget (recommandé)
- étudier son code source : `createRenderObject()` -> `performLayout()`
Dans tous les cas, il est peu probable de bien deviner son comportement en se fiant seulement à son nom.

### Dans un contexte contraignant
Center, Align, Flex voudront être aussi grand que possible.
### Dans un contexte non contraignant
Center, Align, Flex prendront la taille de leur enfant (ou plus si spécifié).
### Dans un context Flex (Row/Column)
Expanded : permet à l'enfant de prendre la place restante le long de l'axe principale
Spacer : permet de prendre de la place (comme un Expanded avec un enfant vide).

https://flutter.dev/docs/development/ui/widgets/layout

## How to debug
https://flutter.dev/docs/development/tools/devtools/inspector

