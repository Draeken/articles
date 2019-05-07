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
- Persistent Volume (PV) : un stockage mise à disposition au niveau du cluster, soit par un administrateur, soit dynamiquement. C'est une ressource au même titre qu'un noeud de cluster. Leur cycle de vie est indépendant des pods du cluster. A l'instar d'un pod, un persistent volume claim (PVC) est une requête pour consommer des ressources PV, en indiquant la taille mémoire, son type (HDD/SDD), son mode d'accès (écriture/lecture). Un PVC ne peut être lié qu'à un seul PV, et un PV n'est lié qu'à un seul PVC. Le PV peut avoir un volume excédent la demande du PVC. Il se peut qu'un PVC ne soit jamais lié à un PV si aucune correspondance n'existe, et si le Dynamic Provisioning n'est pas activé.

CCM: Cloud Controller Manager, à l'opposé de KCM (Kubernetes Controller Manager), permet de faire la liaison avec les services Cloud AWS et GCP. CCM remplace une partie des composants de KCM en les héritant. Le controleur route n'est dispo que pour GCE (Google Compute Engine). Le CCM pour Azure est en cours de développement.

Les conteneurs dans Kubernetes peuvent référencer des images Docker qui ont été mise dans des répo privés. En utilisant que du matériel open sources, il n'y a pas d'intérêt de publier les images autre part que sur le Docker Hub.

Lyfecycle hook : Les conteneurs peuvent réagir à des évenements de type postStart ou preStop, pour gérer le démarrage et l'arrêt du conteneur. Ces méthodes sont appelés au moins une fois par évènement, c'est à dire qu'il faut gérer le cas où le hook est appelé deux fois pour le même évènement (un cas rare). De plus le hook postStart n'est pas nécessairement appelé avant l'ENTRYPOINT du conteneur.

## Docker

Les container reprennent une partie des fonctionnalités de Linux, en particulier ces deux concepts importants :
- les namespaces (2002), permettant de créer des groupes de process ayant chacun leur vision des ressources disponibles. Un groupe voit un jeu de ressource, l'autre groupe en voit un autre.
- cgroups (2007): fonctionne de pair avec les namespaces : permet de contrôler, limiter, hierarchiser et surveiller les ressources utilisées par un groupe de process.

Les images sont composés de layer, chacun étant composé de dossiers et fichiers. Chaque layer est immutable. Le seul moyen de le modifier est de le supprimer physiquement (cela leur permet d'être mis en cache, et d'être partagé comme base d'autre images ou d'autre container).
