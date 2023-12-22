// Next level = baseExperience + (currentLevel * growthRate) ^ 2
const baseExperience = 20;
const growthRate = 5;
const lastMessageTime = new Map();

function calculateNextLevel(level) {
  return baseExperience + Math.pow(level * growthRate, 2);
}

function calculateLevel(xp) {
  return Math.floor(Math.sqrt(xp / baseExperience));
}

function calculateXp(level) {
  return Math.pow(level * growthRate, 2);
}

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

  return xpGain;
}

module.exports = {
  calculateNextLevel,
  calculateLevel,
  calculateXp,
  calculateXpGain,
};
