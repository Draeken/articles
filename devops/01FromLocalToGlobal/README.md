# Comment passer d'un projet local à un produit global ?

# Choisir la plateforme

## Cloud ServerLess
Event -> exec script
event: timer, HTTP

marketplace avec Neo4J / MongoDB -> pas de free tier ou très limité.
utiliser leur solution (Cosmos DB) ?

## Raspberry Pi
RAM limité au niveau hardware -> pas assez pour faire tourner des BDD

## PC fixe
Couteux en énergie, mais directement disponible, et facile à mettre en place.

## NUC
67€ / an (électricité) + coût de l'achat.

# Microsoft Azure
Plein d'offres différentes :
- Azure Functions
- CosmosDB : tarification peu adaptée (400 RU/sec par heure min, et si actif une minute dans une heure, toute l'heure est comptabilisée).
- Kubernets
- app service
  - web app for container

## Azure Functions
Modèle par Consommation (facture que se qui est exécuté) ou via App Service Plan (pas de frais supplémentaires, utilise les VMs disponibles).
Avec le mode consommation, le premier million d'exécution est gratuit.

## Kubernets
Un cluster kubernets est organisé en : un node master qui s'occupe d'orchestrer & les nodes applicatifs.
A nous de définir le nombre et la taille de ces noeuds. C'est à dire le nombre de CPU, le type de mémoire (SSD/HDD) et leurs quantités
Un node est une VM Azure avec les composants nécessaire à l'intégration avec le node master :
- kubelet qui reçoit les requêtes de l'orchestrateur maitre et plannifie leur execution sur ses containeurs.
- kube-proxy pour gérer le réseau virtuel
- Moby, qui gère les containeurs
Le tout est mis sur un système basé sur Ubuntu. Si on veut une config différente (moby, ou un os différent, ou d'autres packages), il faut hoster nous même notre kubernets via aks-engine (projet open source).
Pour faire tourner une instance de l'app, Kubernets utilise un Pod (réplica), qui est lié à un containeur. En avoir plusieurs permet de mettre à jour l'app sans période de deconnection.
On utilise des Kubernets Deployment pour gérer la création des pods. Les soucis au niveau du pod ou du node sont automatiquement gérer. Cela se gère avec des fichiers YAML. On peut également utiliser Helm, qui permet de gérer cette complexité (facilement partageable, répo publique de config Helm (chart), ...)
Dans un cluster Kubernets, il y a la notion de namespace, qui sont des regroupements logiques de Pods et Deployments. Cela permet de les administrer differemment, en controlant leurs accès à différents groupe d'utilisateur par exemple.

