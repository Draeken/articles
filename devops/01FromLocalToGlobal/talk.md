# Comment passer d'un projet local à un produit global ?

## Les différentes solutions
- en local
  - sur son PC
  - sur un p'tit serveur
- shared hosting
- le cloud
  - VM
  - solution dédié
  - kubernetes
  - serverless

### Développement en local
pros:
- Déjà en place
- Opérations simplifiés
- coût faible (électricité)
cons:
- faible disponibilité mondial
- maintenance à notre charge
- doit allumé en permanence

### Développement dans le Cloud
pros:
- grande disponibilité, performance et fiabilité
- maintenance simplifiée
- beaucoup d'outils pour les systèmes complexes
cons:
- peut être long à mettre en place
- peut être coûteux
- attention au vendor lock-in

## Assurer une transition du local vers le cloud

Pour débuter, on peut se contenter du local, pour toute la simplicité qu'il apporte. Surtout si les avantages du Cloud ne nous concernent pas encore (pas besoin d'une grande disponibilité ni d'outils pour monitorer un système complexe). Mais on peut préparer dès maintenant le moment où l'on sera prêt à mettre notre solution dans le cloud.
Pour cela, il faut d'abord voir ce que proposent les services de Cloud:
- Les VM: vous pouvez juste reproduire votre environmemt local
- Les solutions dédiées (dataBase, storage): propre à chacun, c'est pas l'idéal si on veut migrer sur une autre solution.
- serverless: bien pour la partie "logique métier", il est possible avec le framework serverless d'être vendor-agnostic, mais il faudra gérer le stockage/DB via une autre façon
- Kubernetes: permet de tout gérer, statefull/stateless, montée en charge, etc Mais le developpement local n'est pas évident. (Microk8s)
- Docker Swarm: plus user-friendly, et intègre de base le développement local. Moins reconnu par les cloud-vendor ?
Dans tous les cas, containerizer l'app est une bonne idée.