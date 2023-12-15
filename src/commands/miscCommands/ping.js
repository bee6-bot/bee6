const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Retrieves the bot's ping"),

  options: {
    permissions: { ownerOnly: false, devOnly: false },
    cooldown: { enabled: true, time: 5 },
  },

  async execute(interaction) {
    await interaction.reply(
      `🏓 Pong! **Websocket**: ${interaction.client.ws.ping}ms, **REST**: ${
        Date.now() - interaction.createdTimestamp
      }ms`,
    );
  },
};
