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

To help clarity, have lots of space. But should let the user choose a high-density interface (like in GMail or Discord).

## Shapes

Robust shapes without rounded corners, circles (sparcingly)

## Animations

fast, 1-time (2-time is retro-futurist). When focusing on a new component, it moves and expand to the center, if it was displayed in the previous screen. Same thing applies for related elements. Previous elements not needed anymore are discarded by being pushed away.

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
eg: there are components A, B, C
user focus on A. It spawns D and E.
If there is space available to display ABCDE without scrolling, go for it. If not, display ADE.
ABCDE is displayed.
user focus on D. It spawns F and G.
If there is space available to display ABCDEFG without scrolling, go for it. If not, try to display ADEFG. and in last case, DFG.
As we allow direct focus (if component is the parent of multiple focusable components), here is the flow:
there are components A, B, C
B has a components B1, B2, B3 (in a tile format)
user focus on B2. It spawns B2Focused and D.
try to display:

- A.B.B2Focused.C.D
- B.B2Focused.D (skip A and C; keep B)
- B2Focused.D

When user unfocus B2, restore ABC.
Keeping B allow user to fastly change focus on another sibling. This prevent the behavior of "open every interesting child in a new tab, then, browse tabs" which is kind of messy.

Could possibly decide on how much available memory there is. (performance.memory only available on Chrome)
focus are hierarchized: ABC > A(DE) > D(FG). Each focus can be a different layer. Interface try to display a maximum layers begining with the last spawn.

Lots of apps have a navigation bar that have one-click access to all the main components. When focusing one main components, other could be pinned on NavBar?
Main components displayed on home screen should be very "simple" for the sake of global clarity. It's only when user focus one that complexity comes in. Components doesn't morph from simple form to complexe one. Instead, complexity comes from all the assistive components.

Is it viable to have a fractal layout system? It means have different level of focus (focus on main component A which have multiple components, focus on A-A, trigger animations, focus on A-A-A ?) Yes, we can have multiple level of focus but not deep level of containerization : assistive components are always displayed on "root" component. Handle "single main component" differently that when there is many? The point would be to have a component as a context for the children. In this case, reuse the same NavBar but change its content (title, icons, etc).
See the interface like a tree of focusable elements with shortcut to go through branches
Interface should promote feature discoverability and easy access.

# Examples

## Steam

main components:

- store
- library
- community

all these components need maximal view: the more they have available space, the more it's comfortable to use them. When focusing on one of them, discard others. It could be automatically determined by its content if a component apply to this rule (typically list or grid of elements: depending on the number of items: small amount = doesn't need a lot of space).
Unfocused, these components are in their lightest and simplest form.

On Store page, game are displayed similar to main components when there are too many of them: with a tile shape. It follow the same mechanisms.

How to know if it have to belongs to assistive components or inside focused components (especially when focused component was a tile - maybe make it relates with how to desgin the component if it wasn't a tile)

Focus on store: still display the light form but have satelites components (assistive), to help browse the catalog.

User can also focus directly on a game from app focus. It means that user can bypass store focus.
Question:

1. game focus in a list context (store is a list of games)
2. game focus in a standalone context (it may requiere lots of asssistive components)

choice 1 favors an easy browsing / swiping of games, giving just enough information on each game to let the user judge. User can preview what will come next and decide to fastly skip the item.
choice 2 favors a thorough game presentation.
In both case, app should know from where the user focus on a game (it may be store, library or community), and keep that component displayed if possible.

Steam had already implemented the 1st choice, but combined with 2nd: it displays the whole game presentation with 2 choices "interested" or "not interested". It's the same swiping process than dating app.

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
## Main component display:
In
## Parameters & settings
Settings are associated with components (or global app, wich is the root component). Display them on component focus.
secondary elements. (lower priority than assistive components which help taking action) Is located on appBar or similar container. Use similar workflow than low priority components linked to a main component.
~~All settings could be handled in one "big" component (similar to a main component). Should be fractal in its conception to the app. (with potential container bar & secondary elements inside it)~~

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
