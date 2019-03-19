# Comment passer d'un projet local à un produit global ?

https://landing.google.com/sre/books/

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
- blob storage
- app service
  - web app for container

## Azure Functions with Blob Storage
Modèle par Consommation (facture que se qui est exécuté) ou via App Service Plan (pas de frais supplémentaires, utilise les VMs disponibles).
Avec le mode consommation, le premier million d'exécution est gratuit.

## Kubernets
Moteur d'orchestration de conteneurs, pour une mise à l'échelle, un deploiement et une gestion automatique.
Un cluster kubernets est organisé en : un node master qui s'occupe d'orchestrer & les nodes applicatifs.
A nous de définir le nombre et la taille de ces noeuds. C'est à dire le nombre de CPU, le type de mémoire (SSD/HDD) et leurs quantités
Un node est une VM Azure avec les composants nécessaire à l'intégration avec le node master :
- kubelet qui reçoit les requêtes de l'orchestrateur maitre et plannifie leur execution sur ses conteneurs.
- kube-proxy pour gérer le réseau virtuel
- Moby, qui gère les conteneurs (spécial Azure)
Le tout est mis sur un système basé sur Ubuntu. Si on veut une config différente (moby, ou un os différent, ou d'autres packages), il faut hoster nous même notre kubernets via aks-engine (projet open source).
Pour faire tourner une instance de l'app, Kubernets utilise un Pod (réplica), qui est lié à un conteneur. En avoir plusieurs permet de mettre à jour l'app sans période de deconnection.
On utilise des Kubernets Deployment pour gérer la création des pods. Les soucis au niveau du pod ou du node sont automatiquement gérer. Cela se gère avec des fichiers YAML. On peut également utiliser Helm, qui permet de gérer cette complexité (facilement partageable, répo publique de config Helm (chart), ...). Par exemple [un chart pour Neo4j](https://github.com/helm/charts/tree/master/stable/neo4j). Il y a également une chart pour mongoDB (et plein d'autres).
Dans un cluster Kubernets, il y a la notion de namespace, qui sont des regroupements logiques de Pods et Deployments. Cela permet de les administrer differemment, en controlant leurs accès à différents groupe d'utilisateur par exemple.
Kubernetes se déploie sur différents type de plateforme :
- en local:
Il y a plein de solutions différentes pour installer et commencer à développer avec Kubernets en local, par exemple [Minikube](https://kubernetes.io/docs/setup/minikube/) et [MicroK8s](https://microk8s.io/).
- hosté (service kubernetes appartenant au propriétiaire des serveurs)
- turnkey (deploiement sur du cloud infrastructure as a service)
- custom
Le role de kubernets et de s'assurer qu'un cluster soit dans un état défini au préalable par l'utilisateur, à l'aide d'un certain nombre de leviers gérer automatiquement.
Il y a plusieurs niveaux d'abstraction : les objets de base :
- Pod (comme vu précedemment)
- Service : un regroupement logique de Pod qui assure un accès résilient (tandis que les pods sont créé et détruits, avec des IP différentes)
- Volume : des données persistée le temps de vie du Pod, accessible par les différents conteneurs du Pod.
- Namespace (comme vu précedemment)
Au dessus ça, il y a également des services d'une abstraction supérieur :
- ReplicaSet : gère un lot de Pod replica similaire, en garantissant la disponibilité d'un nombre spécifique. En général on ne manipule pas directement de ReplicaSet, mais des Deployment, qui eux même gèrent les ReplicaSet. Si nous avons besoin de mise à jour d'orchestration personnalisé ou pas de mise à jour du tout, nous pouvons utiliser directement les ReplicaSet.
- Deployment : Permet de déclarativement mettre à jour les Pods et ReplicaSets, cela gère plein de cas courants. Un deployment correspond à une version en ligne d'une app
- StatefulSet : C'est le même principe qu'un Deployment, mais pour gérer les applications à état. eg: stockage persistant (BDD).
- DaemonSet : permet de gérer un ou plusieurs pods sur une partie ou l'ensemble des noeuds applicatifs. Pratique pour gérer les logs par exemple ou des démons de surveillance.
- Job: traitement par lot : un job s'occupe qu'un certain nombre de Pod soit exécuté et terminé de manière réussi. Cela gère donc des pods à exécution temporaire (ayant une fin).
