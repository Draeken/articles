# Flutter Layout System
## Questions
How Flutter Layout works
How common widgets act in this system
Common Pitfalls/How to debug

## How Flutter Layout works
https://flutter.dev/docs/development/ui/layout
https://flutter.dev/docs/development/ui/layout/box-constraints
https://flutter.dev/docs/development/ui/layout/constraints
https://flutter.dev/docs/resources/inside-flutter
https://flutter.dev/docs/resources/technical-overview

Dans Flutter, tout est widget, y compris la mise en page. Basiquement, on construit une mise en page en assemblant des widgets responsables d'organiser visuellement leurs enfants. Flutter met à disposition de nombreux widgets de mise en page, couvrant tous les cas généraux (organisation en ligne, colonne, grille, etc...).
(L'algorithme de mise en page vise une performance sous-linéaire, et est exécuté une fois par frame.) Un widget qui calcul sa mise en page appel l'algorithme de tout ses enfants en donnant ses contraintes. Ensuite, il fait remonté sa géométrie à son parent, ce qui lui permet à son tour de calculer sa géométrie. C'est aussi à ce moment la que le parent positionne l'enfant par rapport à son propre espace. Pour atteindre cette bonne performance, il n'y a pas de renvoies entre un widget parent et enfant : tout se décide en une passe.
Dans le cas d'un widget sliver, c'est différent.

## How common widgets act in this system
https://flutter.dev/docs/development/ui/widgets/layout

## Common Pitfalls/How to debug
https://flutter.dev/docs/development/tools/devtools/inspector

