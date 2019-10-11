# Goals & shared values

See: [Purpose, cause, believes](https://github.com/AutoScheduleJS/org/blob/master/README.md#the-purpose-cause--believes)

This design system applies to all tools product helping user managing their time & resources

# Principles:

1. Efficient, that means allow user to use the app as fast as he want. Balance focus on current task & available information that can help performing the current task. Clarity is essential.
2. Try to minimize the time on the app, but don't let user forget it. The magic happens elsewhere.

# Brand Identity & Language

## Theme

 - Neutral
 - Emotionless
 - Robustness
 - Fiability

## Color

Mainly B&W. Subtle colors can be used sparcingly
Gradient
Subtle glow

## Font

Titles & Body: thin sans-serif

## Space

To help clarity, have lots of space

## Shapes

Robust shapes without rounded corners, circles (sparcingly)

## Animations

fast, 1-time (2-time is retro-futurist). When focusing on a new component, it moves and expand to the center, if it was displayed in the previous screen. Same thing applies for related elements. Previous elements not needed anymore are disarded by being pushed away.
 - step-in: move from bottom to base, scale from min to base
 - step-out: move from base to edge, fade out
reverse the direction when unfocus (or when returning to a previous state).
When some components are already on screen but have to be replaced, how to easily avoid crossed path?
Only move the focused component. Side components follow the step-in/step-out process

# Atomic Design

Focus on feature, user action but not entire screen. Then, see what composants are necessary. Atoms are responsive & adaptative. It may includes all necessary information to respond to every cases. Round trip between component detail & whole composition to check if it works well.

# Layout

Grid system: for each focusable component, we define a set of component to be displayed, and the system automatically place them.
Elements of first importance are centered. Related elements are placed nearby. Elements of second impportance are on the edges, far from center.
Grid system assure the good composition of each screen, by adjusting position of each components (main & side), to maintain the whole balanced.
Fixed elements? AppBar, Drawer, NavigationBar, BottomBar? Could be placed like other secondary elements
Elements where visibility change (reduced AppBar upon scrolling)? Another layer ?
Drawer:
- big screen size: always displayed
- medium screen size: toggle, push content
- small screen size: toggle, but is placed in front of content

grid system tackle component display and decide if it's on screen or reduced. Side components could serve as container for other reduced components. In this case grid system is the orchestrator which know which side component use.

Components are linked together semantically: when user focus on a component, he might want additional, helping components, based on what user want to achieve. It's different from workspaces which are just colections of components for a specific context (eg: video edition or animation or image creation). If spawning helping components result in too much scrolling, it could ask user a context (what he intends to do), to restrict the number of components displayed.

there could be different level of focus:
- "permanent" that change the whole layout
- "temporal" that put the component to the top with a scrim.
"temporal" focus could have options:
- can't be dismissed (force action / selection)
- suited for list of focusable elements: allow user to change focus instantly without doing the unfocus + focus on other element

Till there is space available (without scrolling), a focus shouldn't discard current workspace.
eg: there is component A, B, C
user focus on A. It spawns D and E.
If there is space available to display ABCDE without scrolling, go for it. If not, display ADE.
ABCDE is displayed.
user focus on D. It spawns F and G.
If there is space available to display ABCDEFG without scrolling, go for it. If not, try to display ADEFG. and in last case, DFG.
focus are hierarchized: ABC > A(DE) > D(FG). Each focus can be a different layer. Interface try to display a maximum layers begining with the last spawn.

# Examples

## Bank app

On connection, display all main components (or tiles if too much scrolling)
- account monitoring
- money transfert
- contract operations
user can focus on one component and display informative / assistive components, possibly with specific context.
- user focus on account monitoring
- user choose the context: (temporal focus on context selection component)
  - check operations
  - monitor budget
  - search operation
user choose "check operations". The interface display components helping him checking.

# Components
## Home screen:
What to display? In case of there is a main component of 1st importance, display it. It may be strange, on home screen, to display only some components. Add scroll (horizontal in landscape) if all main components can't fit in viewport.
If there is too much scrolling, could replace components with tiles that are a shortcut for component focus.
## main component display:
In
### CASE 1: There is few main components
If device screen width allow to have all the main components be displayed side by side with their comfortable size without horizontal scroll, do it.
Eg: role splitter with schedule & report
but not: Google Keep with Notes & Archived notes: it may be on a different screen, it's just a filter.
### CASE 2: There is a lot of main components
If it's not possible to fit all main components side by side, display a grid of components in a tile style.
Allow multiple components to be displayed side by side by:
- select multiple tiles: combination of keys pressed ; key pressed + click ; long press
- after focus on one tile, have a button to unfocus and add a component?
  - if allowing multiple focus how to handle assistive components like toolbar? which component does it reflect?

Component grouping:
On which factor regroup search, filter, settings, account, notifications, navigation, logo or product name
All of these are "side" or "helper". Grouping is done depending on:
 - semantic / hierarchy
 - requested size.
 - similarity

# Grid Example

Google Keep:
 - list of cards
 - widget to create a new card
 - focus on a card to edit / view
 - filter cards

 Main grid:
 Main: [listOfCards, widgetCreateNewCard]
 Side: [filterCards ]

 listOfCards space request: max.
 widgetCreateNewCard: 1x8

 filterCards: (appBar): 1x5
