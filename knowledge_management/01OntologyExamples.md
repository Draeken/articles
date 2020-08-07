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
(pink apple); brand
(red apple) specified concept
(red & yellow, small, very ripe apple)
