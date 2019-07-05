Profesionalisation of the level-design work.
Level design is split into more specific job, that can be in one of the two categories:
Gameplay: Foorplan, Script, Events, AI, Story
Visual: Material & Textures, Sound, Lightning, 3D modeling, Effects

Before starting, check the feasibility by comparing key points:
- Time: is there a deadline?
- Limitations: you and your team's skills
- Tech: what tools & engine will you use, what are they capable of?
- Purpose: purpose of the level: to be played in single or multiplayer, final stage, etc
- Requirements: what need to be included?
- Gameplay: how the player will play it
- Theme: atmosphere, architecture, realist or not

Theme & Gameplay are the most flexible and you will want to iterate by changing them until it's clear how it will look and play.

See the level as a product on the market, to stand out and be noticed.
Use the 80 - 20 rule: complexity != success. Portal game use less than 50 textures!
Don't make original choice only for the purpose of originality, if they aren't perfectly suited with the 7 key points (theme/atmosphere, gameplay, etc). Features that try to make the level standing out must be build on a solid base relying on the 7 key points.

Why would a player choose this level over that level? What does this level offer that that one does not? How does this level add more depth to the game? How does this level promote teamplay, and that level not?

The more an item/bonus is powerful, the more the risk to obtain it should be high.
Depending of the gameplay, light Pick-ups shouldn't need extra move.

Keep the layout simple for new player, not frustrating them, but add extra depth for experienced players that would want to keep playing it.

Concerning singleplayer:
- NPC should be "living in their world", the goal is make the player feeling the world live by itself.
- Reuse area: hub, preview of next area, revisiting altered area
- don't make it predictable
- landmark: use it to help the player know where he is, to remember the place
- interactivity: every bit of interactivity helps removing the static world feeling.
- pickups can give hint of direction to take
- preview cool part of the level that will appears at the end (climax) right at the start, to pique their interest and hook them.

The player should feel the coldness of the place, the anger in the character,
the pain of the loss, the darkness of the labyrinth, the warmth of the sun on the skin, the sea
spray in their face, and the smell of the sewers.

Geometry:
Stick to a style, theme, and the same level of detail at all timee, to avoid cluttered architecture.
Designers often build levels with real-life sizes in mind: a door is X wide, an object is X tall,
a wall is X thick, etc. Depending on the gameplay, field of view, and player movement, this
may not actually work well, especially if the gameplay is fast and furious. In general, it’s
usually better to overscale a structure than to underscale it.

Sky should be lit: if the sun comes from South, Sky texture should reflect this. And it should live: bird, airplane, light rays, particles, clouds.

Concerning texturing & materials: be consistant, in resolution, scale (or pixel per poly)... Pick some subtles colors and stick to them when creating/choosing a texture. This improve the overall composition. Colors should comply to theme & composition. See Color Theory for more information :) Post processing & color correction are tools that can help achieve that.
Think about how the level will be lit before picking textures: bright and white textures can be lit easily, but not dark or color-satured ones.

Lighting is just as import as geometry

If there are multiple identical light sources in a row, such as the lamps in a corridor above, it can help to give some of the lights a slightly different color or brightness to add additional variation.

Cautious with pure white (eg: white light, white texture) and black spots. There are often boring and doesn't support well atmosphere/theme.
In real life, light bounce and carry surface color - radiosity. Lots of current game doesn't support radiosity and we must fake it through manually set the light color, depending on nearby textures's color.