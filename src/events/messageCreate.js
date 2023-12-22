/**
 * @file messageCreate.js
 * @description Handles the messageCreate event and responds with AI-generated text w/ contextual-awareness (kind of)
 */
const Guild = require("../schemas/guildSchema");
const { globalUserSchema, guildUserSchema } = require("../schemas/userSchema");

const AI = require("./modules/aiMessage.js");
const {
  calculateXpGain,
  calculateNextLevel,
} = require("./modules/leveling.js");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.author.bot) return;

    let guild = await Guild.findOne({ guildId: message.guild.id });
    if (!guild) guild = await Guild.create({ guildId: message.guild.id });

    let globalUser = await globalUserSchema.findOne({
      userId: message.author.id,
    });
    if (!globalUser)
      globalUser = await globalUserSchema.create({ userId: message.author.id });

    let user = await guildUserSchema.findOne({
      user: globalUser._id,
      guild: guild._id,
    });
    if (!user)
      user = await guildUserSchema.create({
        user: globalUser._id,
        guild: guild._id,
      });

    if (guild.optedIn) {
      guild.messagesSent.push({
        time: Date.now(),
        authorId: message.author.id,
        channelId: message.channel.id,
      });
      await guild.save();
    }

    if (guild.levelingEnabled) {
      const xpGain = Math.floor(calculateXpGain(message));
      const nextLevel = calculateNextLevel(user.level);

      user.messagesSent.push({ time: Date.now(), xp: xpGain });
      user.xp += xpGain;
      user.totalXp += xpGain;

      // Check if the user has leveled up
      if (user.xp >= nextLevel) {
        user.level++;
        user.xp -= nextLevel;
        if (guild.levelUpMessages)
          message.reply(`You leveled up to level ${user.level}!`);
      }

      // Check if the user has achieved a leveling role
      const levelingRoles = guild.levelingRoles;
      for (let i = 0; i < levelingRoles.length; i++) {
        if (user.level >= levelingRoles[i].level) {
          const role = message.guild.roles.cache.get(levelingRoles[i].roleId);
          if (!role) continue;
          if (message.member.roles.cache.has(role.id)) continue;
          try {
            message.member.roles.add(role);
          } catch (err) {
            console.log(err);
          }
        }
      }

      await user.save();
    }

    await AI(client, message);
  },
};
