const config = require("../../../config.js");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`ask`)
    .setDescription(`Ask a question to ${config.ai.modelFriendlyName}`)

    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to ask")
        .setRequired(true),
    ),

  async execute(interaction) {
    const data = {
      model: config.ai.defaultModel,
      prompt: interaction.options.getString("question"),
    };

    const options = {
      method: "post",
      url: "http://localhost:11434/api/generate",
      data,
      responseType: "stream",
    };

    let responseText =
      `<@${interaction.user.id}>: ${interaction.options.getString(
        "question",
      )}\n` + `**${config.ai.modelFriendlyName}:** `;
    let wordCount = 0;

    let embed = new EmbedBuilder()
      .setDescription(
        `<@${interaction.user.id}>: ${interaction.options.getString(
          "question",
        )}` + `\n**:thinking: Thinking...**`,
      )
      .setAuthor({
        name: `Powered by ${config.ai.modelFriendlyName}`,
        iconURL: interaction.user.avatarURL(),
      });
    let reply = await interaction.reply({ embeds: [embed] });

    axios(options)
      .then((response) => {
        response.data.on("data", (chunk) => {
          const responsePart = JSON.parse(chunk);
          responseText += responsePart.response;
          wordCount += responsePart.response.split(" ").length;

          if (!responsePart.done) {
            if (wordCount >= 10) {
              wordCount = 0;
              embed.setDescription(responseText);
              reply.edit({ embeds: [embed] });
            }
          } else {
            embed.setDescription(responseText);
            reply.edit({ embeds: [embed] });
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
