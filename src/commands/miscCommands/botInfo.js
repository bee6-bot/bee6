const config = require("../../../config.js");
const moment = require("moment");
require("moment-duration-format");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${config.bot.name.toLowerCase() || "bot-info"}`)
    .setDescription(
      `Displays information about ${config.bot.name || "the bot"}`,
    ),

  async execute(interaction) {
    let description;

    if (config.bot.description) description = config.bot.description;
    else
      description = `This bot is powered by [Discord.js](https://discord.js.org)`;

    // Set up the button row
    const buttonRow = new ActionRowBuilder();

    // Add buttons and add content to the description if applicable
    if (config.bot) {
      if (config.bot.invite)
        buttonRow.addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Invite")
            .setURL(config.bot.invite),
        );

      if (config.bot.support)
        buttonRow.addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Support")
            .setURL(config.bot.support),
        );

      if (config.git.repo && config.git.enabled)
        buttonRow.addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("GitHub")
            .setURL(config.git.repo),
        );
    }

    const data = {
      uptime: moment
        .duration(interaction.client.uptime)
        .format(" D [days], H [hours], m [minutes], s [seconds]"),
      guildCount: interaction.client.guilds.cache.size,
      creationDate: interaction.client.user.createdAt / 1000,
      channelCount: interaction.client.channels.cache.size,
      commandCount: interaction.client.commands.size,
      ping: interaction.client.ws.ping,
    };

    const embed = new EmbedBuilder()
      .setTitle(`${config.bot.name}`)
      .setDescription(description)
      .addFields(
        { name: "Uptime", value: data.uptime, inline: true },
        { name: "Guilds", value: data.guildCount.toString(), inline: true },
        { name: "Version", value: config.bot.version, inline: true },
        {
          name: "Creation Date",
          value: `<t:${Math.floor(data.creationDate)}>`,
          inline: true,
        },
        { name: "Channels", value: data.channelCount.toString(), inline: true },
        { name: "Commands", value: data.commandCount.toString(), inline: true },
        { name: "Ping", value: `${data.ping}ms`, inline: true },
      )
      .setFooter({
        text: `v${config.bot.version} | Made with ❤️`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      components: [buttonRow],
      ephemeral: true,
    });
  },
};
