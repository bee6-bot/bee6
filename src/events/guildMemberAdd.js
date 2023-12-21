const eventLogger = require("bunyan").createLogger({ name: "eventHandler" });
const config = require("./../../config");

const {
  globalUserSchema,
  guildUserSchema,
} = require("./../schemas/userSchema");
const guildSchema = require("./../schemas/guildSchema");

module.exports = {
  name: "guildMemberAdd",
  async execute(client, member) {
    // Check if the guild exists in the database
    let guild = await guildSchema.findOne({ guildId: member.guild.id });
    if (!guild) guild = await guildSchema.create({ guildId: member.guild.id });

    // Check if the user exists in the globla user schema
    let globalUser = await globalUserSchema.findOne({ userId: member.id });
    if (!globalUser)
      globalUser = await globalUserSchema.create({ userId: member.id });

    if (!globalUser || !globalUser._id) {
      eventLogger.error("globalUser or globalUser._id is undefined");
      return;
    }

    // Check if the user exists in the guild user schema
    let guildUser;

    try {
      guildUser = await guildUserSchema.findOne({
        user: globalUser.userId,
        guildId: member.guild.id,
      });
      if (!guildUser)
        guildUser = await guildUserSchema.create({
          user: globalUser.userId,
          guildId: member.guild.id,
        });
    } catch (err) {
      eventLogger.error(err);
    }

    // Save
    try {
      await guildUser.save();
      await globalUser.save();
    } catch (err) {
      eventLogger.error(err);
    }
  },
};
