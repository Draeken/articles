# Plot

Cooking and eating cake is cool. But it requires organisation:
- You may have not have all the necessary ingredients
- It may requires more time than you thought or it needs upward preparation
- You have no idea of which cake you want, which everyone enjoy
- You may have to compute quantities to match the size you want

We want the pastry to be accessible, fun to cook with your friends and without headache!

# How to do that ?

- Suggest user 3 differents cake to be cooked for the next week-end
  - Confirm the date: date should have an slight influance on suggestion (confectiontime)
  - How to make relevant suggestion ?
    - Two discovery, one already ate (could be parameterized)
    - Ensure that a certain distance between suggestions is respected
  - One image per cake with a short description, naming the main ingredients
    - description could be generated from ingredient list and a list of random adjectives
    - photos could be fetched from social media, from specific tags/mention - the one with the most star would be used.
  - get the suggestion from a live collection of recipes that can be filtered (exclude/include)
    - by ingredients
    - by only easy-to-find ingredients
    - by cost
    - by confection time / rest time / bake time
    - by kind (pie, frozen cream, cake, pastry, individual cake)
    - by original country
    - by visual appealing
    - by confidence of enjoyement
    - by texture (crunchy, soft, creamy, frothy)
    - by utensil / equipement (oven, cooler, siphon)
  - have a list of participant: cooker and eater
    - participant doesn't need the app to vote. Only a valid email or name (if no email, participant will vote on the owner device).
    - option to allow them to vote (display percentage of confidence)
      - for each round: eater can vote for one they want to eat and one they don't want (explaining why: taste/allergia or not this time)
      - if no consensus can be found, we go for another round. Can suggest to bake another cake to cover the taste range.
      - tastes are saved for next time
- Allow user to force suggestion
- After suggestion, for compatible cake, suggest decoration and dressing
  - same way of working than for cake suggestion
  - should follow basic rule of taste/color harmony
  - suggestion that are never choose (globally) have less chance to appear with this cake
- After suggestion: let user confirm that he owns the required equipement (only first time seen).
- After suggestion: let user confirm the confection time (with eventually upward preparation, and rest time), to be ready for tea time (default, could be changed)
- After confirming time: Dialog: You can review the shopping list and instructions or leave the app - you will be notified when it's Cake Time!
- After confirming time or when launching the app: shopping list for the next event,
  - user can ask additional "slice" to the cake (default match eaters)
  - when it makes sense, user can choose the size of one slice
  - user can cross items already owned (=> user has at least the quantity required. If slice are added the item is uncrossed ; displaying only the difference could be confusing).
  - user can long press to set the quantity owned (slider from 0 to +20% required)
  - when user lack a little of one ingredient that need to be proportional to other, it can suggest the user to optimize the slice size to match user's ingredient quantities
  - user can touch an item to get more information or request one (maker name, retailer)
    - when user request information, it notify users who made this cake to ask where they bought it, or the name of the branded product
  - user can export / share the list in other product - Google Keep ; email ; sms ; clipboard
  - the export feature should be configured in another screen - to automatically export in other app.
