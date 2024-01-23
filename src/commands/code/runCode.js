const {
  SlashCommandBuilder,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const config = require("./../../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Runs code in the cloud with Piston")
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("The language to run the code in")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName("version")
        .setDescription("The version of the language to run the code in")
        .setRequired(false)
        .setAutocomplete(true),
    ),

  async autocomplete(interaction) {
    const choices = require("./runtimes.json");
    const focusedValue = interaction.options.getFocused();

    const filteredChoices = choices.filter((choice) =>
      choice.language.toLowerCase().includes(focusedValue.toLowerCase()),
    );
    if (filteredChoices.length > 25) filteredChoices.length = 25;

    await interaction.respond(
      filteredChoices.map((choice) => ({
        name: choice.language,
        value: choice.language,
      })),
    );
  },

  async execute(interaction) {
    // code-<language>:<version>
    const modal = new ModalBuilder()
      .setCustomId(
        `code-${interaction.options.getString("language")}:${
          interaction.options.getString("version") || "latest"
        }`,
      )
      .setTitle("Code");

    const codeInput = new TextInputBuilder()
      .setCustomId("code")
      .setStyle(TextInputStyle.Paragraph)
      .setLabel("Code")
      .setPlaceholder("Enter your code here");

    const stdinInput = new TextInputBuilder()
      .setCustomId("stdin")
      .setStyle(TextInputStyle.Paragraph)
      .setLabel("Stdin")
      .setRequired(false)
      .setPlaceholder("Enter stdin here");

    const argsInput = new TextInputBuilder()
      .setCustomId("args")
      .setStyle(TextInputStyle.Paragraph)
      .setLabel("Args")
      .setRequired(false)
      .setPlaceholder("Enter args here, eg. ['--version', '1.0.0']");

    const rows = [
      new ActionRowBuilder().addComponents(codeInput),
      new ActionRowBuilder().addComponents(stdinInput),
      new ActionRowBuilder().addComponents(argsInput),
    ];

    modal.addComponents(rows);
    await interaction.showModal(modal);
  },
};
