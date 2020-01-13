# Main components
## Chunk schedule
### Composed of
  - chunk schedule
  - chunk role assignation (with link to edit role) - modale with role card on mobile; on desktop, always allow easy assignation with keyboard
  - each chunk is focusable and is linked to `Chunk Component` - list of focusable elements
  - period (time range / day) selection
  - preset name that act as a dropdown, if chunks have been modified, automatically save as a new preset with the day's date as name.
### Assisted by
  - each plugin should have its assistive view
### Settings
  - preset management (rename, view, archive)
  - day division ? may be unecessary - chunk edit is available on chunk focus: number of chunk per day, time span, for each day of the week. Preset system (save as preset, load preset, manual edit);
  But how to add a chunk in this setting? when tapping on a empty space? FAB? focus on day -> easy control for deleting/editing or adding - but focus on day & focus on chunk may add too many focusable elements on screen

## Role Manager
### Composed of
  - role display
  - new role action
  - edit role action
  - each role is focusable and is linked to `Role Component` - list of focusable elements
  - archive/unarchive action
  - filter view/search
### Assisted by
  - `role usage history` (cumulative hours / histogram to see usage over time - alternative view): highlight low used role that could be archived
### Settings
  - NA

## Budget Plugin Dashboard
### Composed of
  - display current budget
  - allow changing it (sliders - highlight the given amount vs the total capacity)
  // - allow adding or removing role in budget // is a shared need: role management
### Assisted by
  - past cumulative amount of time used on each role - `Role Usage History`
### Settings
  - NA

# Second Components
## Chunk Component
Is spawned by Chunk Scheduler from a list of many chunks
### Composed of
  - if no role assigned:
    - option to delete it should be here even if it has no role
    - last role assigned
    - list of role with score from plugins
    - link to `Role Manager` component
  - if role has been assigned:
    - current role with option to change it
    - option to edit this individual chunk (time span, name, delete)
### Assisted by
  same as parent component
### Settings
  - option to go to the next chunk after role assignement (if there were none)


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
minimal height: 3 chunks visible, minimal width: one day column.
maximal height: all chunks visible