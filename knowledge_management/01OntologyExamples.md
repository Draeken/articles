## Recipe

Organized like project scheduler: each step has a list of dependences.

### Example

'Rice'(general): definition
'Raw rice'(food): information ; is 'Rice'(general)
'Raw rice'(recipe): price information ; is 'Raw rice'(food)
'Water'(recipe): empty
'Cooked rice'(food): nutritive information ; is 'Rice'(general)
'Cooked rice'(recipe)(court-bouillement): is 'Cooked rice'(food) ; needs x 'Raw rice'(recipe); needs 3x 'Water'(recipe); result in 2x 'Cooked rice'(food);

## Application

Generate presentation (non-linear, prezy-like, with ontology map in a corner).
Input: ontology, what concepts or relations to present (in order), what has to be explained (concept - relation).
How to know what is the minimal set of propeties of a concept that needs to be explained, relative our goal.

Product & Recipe store

## Why
A world where every single point of view is respected.

## How
Representation of knowledge subjective to each.
(concept) : characteres, stories, actions, landmark, laws, justice, friendship, love, recipe
concepts are subjective and there could be an infinit amount of slightly different definition of the "same" concept.
concept have properties.
concept adheres/agrees to subjective version of other concepts.
concept can evolve (properties, or adherence to other concepts).

Define concept in optic to compare it with similar concept. eg: define recipe to allow comparison with similar recipes.

Concepts start by being owned by its creator, but if enough people connects with this concept, it becomes public. If you make a modification, then it may asks its users to follow the update or to stay on the unmodified concept.

(user 1)->(concept A)<-(user 2)

user 1 updates concept A, user 2 stay on unmodified concept A
(user 1)->(concept A with diff)->(concept A)<-(user 2)

user 2 follow updates
(user 1)->(concept A')<-(user 2)

---

(user 1)->(concept A with diff)->(concept A)<-(user 2 + user 3)

user 4 join concept A with diff
(user 1 + user 4)->(concept A with diff)->(concept A)<-(user 2 + user 3)

user 3 auto-switch on concept with the most users
(user 1 + user 3 + user 4)->(concept A with diff)->(concept A)<-(user 2)

---

(apple); root concept for apple
(default apple)
(pink apple); brand <- not supposed to be in this DB
(red apple) specified concept
(red & yellow, small, very ripe apple)
(vin blanc sec)

---

Each user can create a new entry, that can depict generic product, raw product, or final product (obtained from recipe).
For well-known branded product, (oreo), it can be concidered as a generic product label, and accepts original oreo and bootlegs as implementation.
Entry's label is in user's language, and may have alias & ISO denomination (pain au chocolat, chocolatine / oreo, biscuit au chocolat fourré à la crème pâtissière). It provides properties (composition of properties), nutritive information could be informed through a property (eg: nutrition = nutritionOf(apple)).
For an existing final product entry, an user could copy it to adapt it to its language/region. Equivalence between two products is subjective and should be an entry. Equivalence could inform the target audience (country, culture, region).
Equivalence is a way to give a local name to a foreign product.
Implementation of concepts (products found in supermarket) could be linked to concept by users, specifying a level of quality for each product. Implementations are handled in another DB (like OpenFoodFacts), where users could rate and categorize (discount - standard - premium) products.
Does raw product concept needs to be localized? We could have an unique tomato concept and have recipes using tomatos be localized. But tomato concept will have tons of links to implementations. If implementation are localized, it could filter to suit recipes.
But it's better to have raw product concept be localized: fewer links & for aggregated info, it's less prone to large variations.

## Is it possible to have the same concept name under the same localization?
Yes -> when someone wants to edit description or properties
No -> avoid duplicate ;

to conclude: yes -> add "last update", with "used by [count]" it should suggest the best suit.

## What kind of raw product to register
generic localized (product that comes to mind in this localization).
specified product () -> should it includes a field to the "parent" or "generic" concept? Yes -> avoid having too many raw product concept ; when asking user if there is tomatoes in this market, if the response is "no", don't ask for specified tomatoes.

## List of item types
- raw_product
- product_class
- equivalence
- recipes

## How to register a raw product
is: raw_product
Name/description; (apple/red apple)
Localization (town;state/region;country;culture/civilization)
specialization of -> raw product concept
nutritional information -> table //aggregated from implementers ()
color
price -> aggregated from implementers

Nutritional information are often given for a general class and not for varieties, or varieties are specified through difference with general class.
Raw product could describe the default or the most common variety. Then all varieties are grouped together using a new class.

## Classification/groups
Subjective user create a new class as a new concept.