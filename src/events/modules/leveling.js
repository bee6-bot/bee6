// Level formula: 5 * (lvl ^ 2) + (50 * lvl) + 100 - xp
const lastMessageTime = new Map();

/**
 * Calculates the experience needed to reach the next level.
 *
 * @param {number} level - The current level.
 * @return {number} - The experience needed to reach the next level.
 */
function calculateNextLevel(level) {
  return 5 * Math.pow(level, 2) + 50 * level + 100;
}

/**
 * Calculates the level based on the given experience points.
 *
 * @param {number} xp - The experience points to calculate the level for.
 * @return {number} - The calculated level.
 */
function calculateLevel(xp) {
  const level = Math.floor((-50 + Math.sqrt(2500 + 20 * xp)) / 10);
  return Math.max(level, 0);
}

/**
 * Calculate the total experience points for a given level.
 *
 * @param {number} level - The level for which to calculate experience points.
 * @return {number} - The total experience points.
 */
function calculateXp(level) {
  return 5 * Math.pow(level, 2) + 50 * level + 100;
}

/**
 * Calculates the experience points (xp) gain for a user based on a given message.
 *
 * @param {object} message - The message object containing the user's message content.
 * @return {number} The calculated xp gain for the user.
 */
function calculateXpGain(message) {
  const maxLength = 200;
  const minTime = 60000;

  // Get the length of the message and cap it at the maximum length
  let length = message.content.length;
  if (length > maxLength) length = maxLength;

  // Calculate the base experience points based on the length
  // 5 xp per 5 characters
  let xpGain = Math.floor(length / 10) * 20;

  // Get the time since the user's last message
  const now = Date.now();
  const lastTime = lastMessageTime.get(message.author.id) || now;

  // Dynamically reduce the xp gain based on the time since the user's last message
  const timeDifference = now - lastTime;
  if (timeDifference < minTime) {
    const reductionFactor = timeDifference / minTime;
    xpGain *= reductionFactor;
  }

  // Update the last message time
  lastMessageTime.set(message.author.id, now);

  console.log(`XP gain: ${xpGain}`);
  return xpGain;
}

module.exports = {
  calculateNextLevel,
  calculateLevel,
  calculateXp,
  calculateXpGain,
};
