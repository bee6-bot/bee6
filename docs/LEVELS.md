# Levels

[src/commands/levels/](../src/commands/levels/) [events/modules/leveling.js](../src/events/modules/leveling.js)

BEE6, of course, rewards users with XP when they send a message.

## How it works

BEE6 rewards users with experience points (XP) when they send a message. The leveling system is implemented using the
provided `leveling.js` module, which contains functions to calculate levels, experience points, and XP gain.

### Level Formula

The experience needed to reach the next level is calculated using the following formula:

```text
5 * (lvl^2) + (50 * lvl) + 100 - xp

where lvl is the current level
and xp is the current experience points
```

This formula is also used by [MEE6](https://mee6.xyz/). This is so we can easily allow our users to migrate away from
MEE6 while preserving their levels.

### Functions

`calculateNextLevel(level)` Calculates the experience needed to reach the next level based on the current level.

`calculateLevel(xp)` Calculates the level based on the given experience points.

`calculateXp(level)` Calculates the total experience points for a given level.

**`calculateXpGain(message)`** Calculates the experience points (XP) gain for a user based on the content length of
their message and the time elapsed since their last message.

The base XP is determined by the length of the message (5 XP per 5 characters).
XP gain is dynamically reduced based on the time elapsed since the user's last message, with a minimum time threshold.
The last message time is tracked to ensure proper XP calculation.
