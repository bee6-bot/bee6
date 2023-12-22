const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const config = require("./../../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("consent")
    .setDescription("Shows your consent status")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const dataCollected = {
      commandsUsed:
        "We collect the commands you and your members use, and how often they are used.",
      messagesSent:
        "We collect the time, author, and channel of every message sent in your server, we do not collect the content of the message.",
      membersJoined:
        "We collect the time and ID of every member that joins your server.",
      membersLeft:
        "We collect the time and ID of every member that leaves your server.",
    };

    const consentRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Agree")
        .setCustomId("agree"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel("Disagree")
        .setCustomId("disagree"),
    );

    const embed = new EmbedBuilder()
      .setTitle("Update consent")
      .setDescription(
        `${config.bot.name} comes with the ability to collect analytics data. This data can be used by` +
          ` server owners to see how their server is being used, and for us to see how many servers are using` +
          ` ${config.bot.name} and what features are being used.` +
          `\n\n` +
          `# What data is collected?` +
          `\n` +
          `The following data is collected:` +
          `\n` +
          `- ${dataCollected.commandsUsed}` +
          `\n` +
          `- ${dataCollected.messagesSent}` +
          `\n` +
          `- ${dataCollected.membersJoined}` +
          `\n` +
          `- ${dataCollected.membersLeft}` +
          `\n\n` +
          `# How is this data used?` +
          `\n` +
          `This data is used to help us improve ${config.bot.name} and to help us see how many servers are using` +
          ` ${config.bot.name} and what features are being used. Remember, ${config.bot.name} is open source,` +
          ` so you can see exactly what data is being collected and how it is being used by viewing` +
          ` the source code.` +
          `\n\n` +
          `# How can I opt out?` +
          `\n` +
          `You can opt out of analytics data collection by clicking the "Disagree" button below.` +
          ` You can opt back in at any time by running this command again and clicking the "Agree" button.`,
      )
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      components: [consentRow],
      ephemeral: true,
    });
  },
};
