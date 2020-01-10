# Main components
## Chunk schedule
### Composed of
  - chunk schedule
  - chunk role assignation (with link to edit role) - could be with drag&drop on desktop & modale with role card on mobile; on desktop, always allow easy assignation with keyboard
  - period (time range / day) selection
  ### With Assistance of
  - each plugin should have its assistive view

## Role Manager
### Composed of
  - role display
  - new role action
  - edit role action
  - archive/unarchive action
  - filter view/search
  ### With Assistance of
  - role usage history (cumulative hours / histogram to see usage over time - alternative view): highlight low used role that could be archived

## Budget Plugin Dashboard
### Composed of
  - display current budget
  - allow changing it (sliders - highlight the given amount vs the total capacity)
  // - allow adding or removing role in budget // is a shared need: role management
### With Assistance of
  - past cumulative amount of time used on each role - Role Usage History

# Assistive Components
## Budget Plugin Assistance
### Composed of
  - comparison of goal budget over current role use
  - time range filter for role usage

## Role Usage History
### Composed of
  - current hours for each role + highlight difference in usage between roles.
  - histogram to emphaze the different era of role priority (where was the last time where I prioritize role B ?)
  - date range selection
  - role filter (by name, used in the last 6 months)

# Design details
## Chunk schedule
### Icon
give the idea of a chunk schedule : linear vertical rectangles fill with different colors to represent different roles