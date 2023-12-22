const Guild = require("../../schemas/guildSchema");

module.exports = {
  name: "disagree",
  async execute(client, interaction) {
    const guild = await Guild.findOne({ guildId: interaction.guildId });
    const member = interaction.member;

    if (!guild)
      return interaction.reply({
        content: "This guild is not registered in the database.",
        ephemeral: true,
      });
    if (!member)
      return interaction.reply({
        content: "This member is not registered in the database.",
        ephemeral: true,
      });

    if (!guild.optedIn)
      return interaction.reply({
        content: "This guild has already opted out of analytics.",
        ephemeral: true,
      });

    guild.optedIn = false;
    await guild.save();

    interaction.reply({
      content: "This guild has been opted out of analytics.",
      ephemeral: true,
    });
  },
};
