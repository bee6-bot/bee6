/**
 * @name guildSchema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guildSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],

  // Analytics
  optedIn: { type: Boolean, default: false },
  commandsExecuted: { type: Array, default: [] },
  messagesSent: { type: Array, default: [] }, // { time: Date, authorId: String, channelId: String }
  membersJoined: { type: Array, default: [] }, // { time: Date, memberId: String }
  membersLeft: { type: Array, default: [] }, // { time: Date, memberId: String }

  // Leveling
  levelingEnabled: { type: Boolean, default: true },
  levelingRoles: { type: Array, default: [] }, // { level: Number, roleId: String }
  levelUpMessages: { type: Boolean, default: true },

  // Moderation
  moderationEnabled: { type: Boolean, default: true },
  modLogChannel: { type: String, default: null },
  mutedRole: { type: String, default: null },

  // Economy
  economyEnabled: { type: Boolean, default: true },
  economyLogChannel: { type: String, default: null },
  economyLog: { type: Array, default: [] }, // { time: Date, type: String, userId: String, amount: Number }
  economyLogEnabled: { type: Boolean, default: true },
  economyLogLimit: { type: Number, default: 100 },

  // Welcome
  welcomeEnabled: { type: Boolean, default: false },
  welcomeChannel: { type: String, default: null },
});

module.exports = mongoose.model("Guild", guildSchema);
