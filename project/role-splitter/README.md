# Why

We think that it's hard to work alone on a project: we have to handle lots of things from different point of view (multiple hats, like developer, designer, business, etc...). We think it's easier to work on similar things in batch, using one hat, rather than incessantly jungling between different roles. What is though: keeping a balanced life between all these roles.

# How

With simplicity and efficiency

# What

A product to let you split your days in chunks, and associate a role on each chunk - like a time tracker. You can define a Chart goal and compare it to your actual role use, on the 2 last weeks. This way, you can see what roles are underused and plan accordingly. They may have other tools to help you plan which role to prioritize, like:
- assigning tasks to role with a minimal estimated hours for completion. Don't switch to a role which hasn't the required minimal hours of work. It's like washing the dishes, it needs a minimal amount of dishes to be optimal.
- in business there are a lot of method to determine what to do next.
It may be interesting to have a plugin system to let user choose whih tools to enable. Role budget can be seen as a plugin to help user choosing his role.

# Users

In a first time: me
People who want an easy time-tracking focused on assigning role to day chunk.

# Needs

The global user need is to make a good use of his time according to his goals. While a solution that could automatically plan user's time isn't available, we could fall back to a set of assistive tools to help user plan his time by choosing which role to play.
There are needs from the chunk system framework, and needs for each individual plugin.

## Shared needs
User needs to plan what to do next. => schedule of future chunks that user can assign to specific role, with recommendations.
System needs to know:
- when assigning a chunk: for each role: have a recommendation score computed by each enabled plugin (main comp)
- which roles are available (give default role) (main comp) - there should be shortcut to avoid going back to the root view.
- how chunks are organized among the week (give default organization) (chunk schedule parameter)
- which plugins are enabled (all by default) (app parameter)
- plugin's configuration (give a default one) (mains comp - one per plugin)

## Budget plugin needs
- define the chart goal - maybe with an option to set a minimal amount of hours
- edit past chunk affectation

NB: multiple plugins could need the same data/component (eg: chunk usage history)
## Task plugin needs
- affect tasks to role
- edit tasks done

## Futher needs
- multiple devices
- on mobile app, could use notifications & quick response - a way to track chunks without opening the app

# Properties

To compare what roles are actualy used to what should be used, we need:
- know the amount of time used on each role
- know when this amount of time was used (allow comparison in a specific date range)

solutions:
track time by declaring activities, with accurate boundaries -> toggle
pros:
- accurante
- flexible
cons:
- cumbersome to declare accurante boundaries everytime

track time by declaring role on chunk
pros:
- give an idea on how to cut your day
- declare role tracking with ease
cons:
- cumbersome to edit chunk cutting (may use different template to remedy that)

Chunks properties:
- two chunks can't overlaps
- one chunk can only be before or after another chunk