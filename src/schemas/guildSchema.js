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
});

module.exports = mongoose.model("Guild", guildSchema);
