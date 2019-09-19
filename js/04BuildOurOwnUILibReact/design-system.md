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

fast, 1-time (2-time is retro-futurist)

# Atomic Design

Focus on feature, user action but not entire screen. Then, see what composants are necessary. Atoms are responsive & adaptative. It may includes all necessary information to respond to every cases. Round trip between component detail & whole composition to check if it works well.

Grid system: for each focusable component, we define a set of component to be displayed, and the system automatically place them.
Elements of first importance are centered. Related elements are placed nearby. Elements of second impportance are on the edges, far from center.

# Base Cases

## Home screen:
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
