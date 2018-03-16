## Recipe

Organized like project scheduler: each step has a list of dependences.

### Example
'Rice'(general): definition
'Raw rice'(food): information ; is 'Rice'(general)
'Raw rice'(recipe): price information ; is 'Raw rice'(food)
'Water'(recipe): empty
'Cooked rice'(food): nutritive information ; is 'Rice'(general)
'Cooked rice'(recipe)(court-bouillement): is 'Cooked rice'(food) ; needs x 'Raw rice'(recipe); needs 3x 'Water'(recipe); result in 2x 'Cooked rice'(food);
