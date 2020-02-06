# Why

Conceiving layout is cumbersome.

# How

Given a grid and a list of potential components to be placed on the grid with placement preference.
How it will be used for layout creation?
- Compute grid size from viewport size, cells have a minimal size before splitting up.
- Feed `auto-layout` with grid size & component requirements.
- Build the layout.

## Cases
ABC -> focus on C, keeps BC, spawns DE.
If ABCDE can be displayed:
Move C to center, push AB on right border, spawns DE on C side

# What
Grid size: [width, height]
Component requirements: [mainComp[], assistiveComp[], prevSpace[]]
