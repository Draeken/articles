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

### DE needs
It would be simpler to express the component size in term of a multiple of a base square.

### Manual Process

Create a grid layout manually, assign main component on it.
Media query: if not enough space, use tile component.

When focusing on a main component: have to create another grid. With React Router + animation, it could transition with respect to DS.