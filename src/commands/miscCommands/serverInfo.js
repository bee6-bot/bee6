const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription(`Retrieve information about the current server`),

  async execute(interaction, client) {
    if (!interaction || !client)
      return console.log("Missing interaction or client");

    // Get the guild ID from the interaction
    const guildId = interaction.guildId;
    const guild = client.guilds.cache.get(guildId);

    // Convert the date to a Unix timestamp
    let timeCreated = guild.createdAt;
    timeCreated = timeCreated.getTime();

    // noinspection JSCheckFunctionSignatures - WebStorm is wrong
    const infoEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .addFields(
        { name: `Owner`, value: `<@${guild.ownerId}>`, inline: true },
        { name: `Members`, value: `${guild.memberCount}`, inline: true },
        { name: `Roles`, value: `${guild.roles.cache.size}`, inline: true },
        {
          name: `Categories`,
          value: `${
            guild.channels.cache.filter((channel) => channel.type === 4).size
          }`,
          inline: true,
        },
        {
          name: `Channels`,
          value: `${guild.channels.cache.size}`,
          inline: true,
        },
        {
          name: `Voice Channels`,
          value: `${
            guild.channels.cache.filter((channel) => channel.type === 2).size
          }`,
          inline: true,
        },
        {
          name: `Boosts`,
          value: `${guild.premiumSubscriptionCount}`,
          inline: true,
        },
        {
          name: `Created`,
          value: `<t:${Math.round(timeCreated / 1000)}>`,
          inline: true,
        },
      );

    try {
      if (interaction.deferred || interaction.replied)
        await interaction.editReply({ embeds: [infoEmbed] });
      else await interaction.reply({ embeds: [infoEmbed] });
    } catch (error) {
      console.log(error);
    }
  },
};
