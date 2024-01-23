const axios = require("axios");
const {
  EmbedBuilder,
  ActionRow,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const config = require("../../config");

async function runCode(code, language, stdin = "", args = [], version) {
  // POST request
  const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
    version: version,
    language,
    files: [{ name: "main", content: code }],
    stdin,
    args: args.split(" ") || [],
  });

  return response.data;
}

module.exports = {
  name: "code",
  async execute(client, interaction) {
    await interaction.deferReply();

    const input = {
      code: interaction.fields.getTextInputValue("code"),
      stdin: interaction.fields.getTextInputValue("stdin") || "",
      args: interaction.fields.getTextInputValue("args") || "",
      language: interaction.customId.split("-")[1].split(":")[0],
      version: interaction.customId.split("-")[1].split(":")[1],
    };

    const output = await runCode(
      input.code,
      input.language,
      input.stdin,
      input.args,
      input.version,
    );

    const actionRow = new ActionRowBuilder();

    const fixButton = new ButtonBuilder()
      .setCustomId("fix")
      .setLabel("Fix bugs with AI")
      .setEmoji("✨")
      .setStyle(ButtonStyle.Primary);

    const embed = new EmbedBuilder()
      .setTitle(`${output.language} v${output.version}`)
      .setDescription(`\`\`\`${output.run.stdout}\`\`\``)
      .setTimestamp();

    if (output.run.stderr) {
      embed.setDescription(`\`\`\`${output.run.stderr}\`\`\``);
      await interaction.editReply({
        embeds: [embed],
        components: [actionRow.addComponents(fixButton)],
      });

      const filter = (i) =>
        i.customId === "fix" && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        const chatHistory = [];
        chatHistory.push(
          {
            role: "system",
            content:
              "You are an AI-powered pair programmer. You are here to help fix bugs in code.",
          },
          {
            role: "user",
            content:
              `I am trying to fix this bug: \`\`\`${output.run.stderr}\`\`\`` +
              `\n` +
              `I am using ${output.language} v${output.version},` +
              `this is the code causing the issue: \`\`\`${output.code}\`\`\``,
          },
        );

        if (config.ai.openrouter.enabled) {
          const pendingMessage = await interaction.followUp({
            content: "Fixing bugs with AI...",
          });

          await fetch(`${config.ai.openrouter.url}/api/v1/chat/completions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${config.ai.openrouter.token}`,
              "Content-Type": "application/json",
              "X-Title": `A Discord Bot`,
            },
            body: JSON.stringify({
              model: config.ai.openrouter.defaultModel,
              messages: chatHistory,
            }),
          })
            .then((res) => res.json())
            .then(async (json) => {
              await pendingMessage.edit({
                content: `:sparkles: ${json.choices[0].message.content}`,
              });
            });
        } else {
          await interaction.reply({ embeds: [embed] });
        }
      });
    }
  },
};
