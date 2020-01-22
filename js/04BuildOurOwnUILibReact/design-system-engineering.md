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
2|3|3|3
2|3|3|3
2|2|2|2
2|2|2|2
1|1|1|1
Place a clone of this component
Test each side & corner for lowest score
bottom, bottom right, bottom left have the lowest score