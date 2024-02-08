const { SlashCommandBuilder } = require("discord.js");
const {
  guildUserSchema,
  globalUserSchema,
} = require("../../schemas/userSchema");
const guildSchema = require("../../schemas/guildSchema");

const { calculateXp } = require("../../events/modules/leveling");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows the level of a user.")

    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to show the level for.")
        .setRequired(false),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const guildId = interaction.guild.id;

    const globalUser =
      (await globalUserSchema.findOne({ userId: target.id })) ||
      (await globalUserSchema.create({
        userId: target.id,
        level: 0,
        xp: 0,
        totalXp: 0,
      }));

    const guild =
      (await guildSchema.findOne({ guildId: guildId })) ||
      (await guildSchema.create({ guildId: guildId }));

    const guildUser =
      (await guildUserSchema.findOne({
        user: globalUser._id,
        guild: guild._id,
      })) ||
      (await guildUserSchema.create({
        user: globalUser._id,
        guild: guild._id,
      }));

    const levelData = {
      curLevel: guildUser.level,
      curXp: guildUser.xp,
      totalXp: guildUser.totalXp,
      xpToNextLevel: calculateXp(guildUser.level + 1) - guildUser.xp,
      xpProgress: Math.round(
        (guildUser.xp /
          (calculateXp(guildUser.level + 1) - calculateXp(guildUser.level))) *
          100,
      ),
    };

    await interaction.reply({
      content:
        `**${target.username}** is level **${levelData.curLevel}**` +
        ` and is **${levelData.xpProgress}%** to level ${
          levelData.curLevel + 1
        }!`,
    });
  },
};
