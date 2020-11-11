# Layout Engine
Component size requirement is dynamic, it may vary on its also dynamic content. Exact size may not be determined without drawing the component on screen, rather, it may provide an estimation.
Number of main/assistive component may be dynamic (eg: some can be enabled/disabled by user).
Is it possible to have chunk loading with auto-layout? Yes with React.lazy : lazy-load component on first render. It uses a component placeholder while the goal component is loaded. With this system, it may be necessary to know the size requirement before loading the component. The size requirement function could be exported as a standalone.
How auto-layout layout ? It needs:
- minimal size (0)
- best size (1)
- if best size is infinite in both axis, which axis to prioritize growth.

## Largest first
then try to maximize the satisfaction score.
take the largest area (best size) component and place it on center, then add the second largest to one side of the root area and push the primary comp already placed in order to have the same satisfaction.
How to know on which side the newly component have to be added?

## Potentials
It's like auto-schedule algorithm but in 2D space rather than 1D. Issue: none of the component have a prefered place ?
Portrait:
x|x|x|x
x|x|x|x
x|x|x|x
x|x|x|x
x|x|x|x
Place a component with infinite both axis & Y favored. min size: 3x2
2|x|x|x
2|x|x|x
2|2|2|2
2|2|2|2
1|1|1|1
Place a clone of this component
Test each side & corner for lowest score
bottom, bottom right, bottom left have the lowest score
go for bottom right:
2|x|x|x
2|x|x|x
2|2|2|2
2|y|y|y
1|y|y|y

update previously placed components potential:
2|x|x|x
2|x|x|x
2|2|2|2
0|y|y|y
0|y|y|y

update last placed compont potential:
2|x|x|x
2|x|x|x
4|4|4|4
2|y|y|y
2|y|y|y

place z: 1x2 fixed size component, then update potentials:
z|x|x|x
z|x|x|x
2|4|4|4
2|y|y|y
2|y|y|y

after all elements are placed, make them fill available space:
if we start by x:
z|x|x|x
z|x|x|x
0|x|x|x
2|y|y|y
2|y|y|y
a cell got a 0 potential score, which is bad because we want to optimize space use

if we start with y:
z|x|x|x
z|x|x|x
y|y|y|y
y|y|y|y
y|y|y|y
success, even if y has a far better score than x

layer displaying both component potentials
3|4|4|4
4|5|5|5
4|4|4|4
4|5|5|5
3|4|4|4
Materialization of first component, remove its layer potential:
1|x|x|x
2|x|x|x
2|2|2|2
2|3|3|3
2|3|3|3

## With CSS Grid
Could use a predefined layout organization choosed from what components to display. Then build the layout with css grid.
predefined layout:
stack of horizontal cell
____
____
____
stack of vertical cell
|||
|||
|||
layout can be parameterized to suit component needs.
screen can be divided into multiple patterns

## DE needs
It would be simpler to express the component size in term of a multiple of a base square.

## Manual Process

Create a grid layout manually, assign main component on it.
Media query: if not enough space, use tile component.

When focusing on a main component: have to create another grid. With React Router + animation, it could transition with respect to DS.

## Potentials V2
Grid size: 4x2, two components with minimal 1x2 & best: infinityx2, spawn in center.
xxxx
xxxx
place A:
xaxx
xaxx
potentials:
2322
2322
place B:
xabx
xabx
potentials:
4554
4554
materialize A:
2232
2232
xaxx
xaxx
update potentials:
0x32
0x32
materialize B:
0x00
0x00
xabx
xabx
How to growth min-sized requirement to their best ? compute a comfort score & compare to comfort score mean of all other potentials, increamenting slowly target's comfort.
How to compute comfort for a potential ?
eg:
3 same requirements on a 1x6 grid:
1st materialization should not span 3 cells (aaaxxx -> both remaining potentials, individually, has the same comfort score than the materialized), instead, it should span 2 cells to make room for other (aabbcc)
Other strategy: place all requirements in min-size then, make them growth poco a poco. Compute comfort score by "how much larger it is from the min-size area" (instead of comparing relative to the best-size). How to push side component in order to grow ?
xxxxxx
xxxxxx
xxxxxx
xxxxxx
xxxxxx
xxxxxx
push 'a' to center:
xxxxxx
xxxxxx
xx33xx
xx33xx
xxxxxx
xxxxxx

## Physics based
requirements: center; min-size: 1x1, comfort: 3x3
center has a greater gravity force.
pick a free cell near center, then apply force

Physics based consume too much resources, and can hardly be on server-side due to the high amount of state to compute, if we want all state to be determined with the first serving. Pre-determined spaces with permutations should be easier.

## Placement based on growing axis
Component could be placed appropriatly on a grid based on their growing axis. Place them with their minimal shape, then make them grow.
group components by similar growth scheme and place them simultaneously.
- both axis : center
- vertical axis : left/right sides
- horizontal axis : top/bottom sides

## Architecture
grid size + components -> placement
using css grid: use absolute size for fixed size components & flex unit (fr) for growing components.
What could be interesting: with a list of components, give a set of grids which are like breakpoints:
for each grid there is a different layout setting. Express grid using css grid declaration. (grid-template-areas)