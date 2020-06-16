## À traiter

Sujet: mettre en place une bibliothèque écrit en TypeScript destiné à être utilisé dans un projet ayant une étape de build (et pas directement importé dans le HTML).
Utiliser les bonnes pratiques d'un projet OpenSource et mettre en place le tooling pour nous aider à maintenir et publier le projet.
- init package
- Linter
- Coding style
- Tests
- Mise à jour des dépendances
- Config de tsc pour générer la dist
- Génération de la doc
- Travis
- Semantic Release & commitizen
- Release automatique
- Changelog automatique
- Mise en place de la page GitHub (badges, présentation, etc...)
- Management des dépendances : quoi déclarer dans devDependencies/PeerDependencies/Dependencies, comment ne pas alourdir pour le client ?

## Axes
- Côté utilisateurs: métrics de confiance: couverture de test, dépendances à jour ; manière dont c'est distribué, documentation, simplicité d'utilisation, popularité.
- Côté contributeurs: documentation du code et globalement du projet, qualité du code, simplicité du workflow, système de validation des contributions.

## Structure
- Base minimum pour distribuer sa bibliothèque
  - Le build
  - Les tests
  - Configurer Semantic Release
  - Le package.json
  - L'intégration continue
  - Le packaging

  ## Lien
  https://medium.freecodecamp.org/how-i-got-1000-%EF%B8%8F-on-my-github-project-654d3d394ca6

  https://medium.freecodecamp.org/how-to-get-up-to-3500-github-stars-in-one-week-339102b62a8f

http://shields.io/