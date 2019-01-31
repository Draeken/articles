# Plot
DB of all grocery products associated with supermarket & price.
Could use products info from OpenFoodFacts. We want it to be focused on local options, taking into account small market, itinerant market, etc...

# SaaS Application
Game: race number of scanned missing articles in a store.
Easily scan articles in a store -> app know in which store you are, you just have to scan and type the price.

scan a receipt to enrich the DB.

Give a shopping list and a position, get a list of roadmap (like GMap results for route), with associated prices (and time needed)

# Architecture
DB with: stores with products availability, local store with products availability & prices, products.
MongoDB: stores with mean of its local stores about products info.
local store which overwrite its store info.
Neo4J: Products with category as node.
for discount code, maybe use a new field with { function: fnName, productId: }

main workflow: user has a list of starred local stores + list of products. We check store that have the products. If there is no information, we check the associated main store.

# Other project
- basket: app that give you the market where you will pay the least, worldwide, community driven
- http://www.mesprovisions.com
- http://anti-crise.fr
- http://prixing.fr/

- https://market.mashape.com/Datagram/products : API localisé avec prix