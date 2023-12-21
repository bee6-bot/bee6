/**
 * @name userSchema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// There are two user schemas
// 1. global user schema
// 2. guild user schema
// The global user schema is used to store user data that is not guild specific (e.g. user settings)
// while the guild user schema is used to store user data that is guild specific (e.g. economy data)

// Global user schema
const globalUserSchema = new Schema({
  // User data
  userId: { type: String, required: true, unique: true },

  // Flags
  isDeveloper: { type: Boolean, default: false },
  isContributor: { type: Boolean, default: false },
  isBlacklisted: { type: Boolean, default: false },

  preferences: {
    language: { type: String, default: "en" },
    levelUpMessages: { type: Boolean, default: true },
    levelUpDMs: { type: Boolean, default: false },
  },
});

// Guild user schema
const guildUserSchema = new Schema({
  // Link to guild/global user
  user: { type: Schema.Types.ObjectId, ref: "User" },
  guild: { type: Schema.Types.ObjectId, ref: "Guild" },

  // Leveling data
  level: { type: Number, default: 1 },
  totalXp: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },

  // Economy data
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  inventory: { type: Array, default: [] },

  // Stats
  messages: { type: Number, default: 0 },
  commands: { type: Number, default: 0 },

  moneyEarned: { type: Number, default: 0 },
  moneySpent: { type: Number, default: 0 },
  moneyGambled: { type: Number, default: 0 },
  moneyRobbed: { type: Number, default: 0 },
  moneyGiven: { type: Number, default: 0 },
});

// Export schemas
module.exports = {
  globalUserSchema: mongoose.model("User", globalUserSchema),
  guildUserSchema: mongoose.model("GuildUser", guildUserSchema),
};
