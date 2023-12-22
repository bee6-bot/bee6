const { SlashCommandBuilder } = require("discord.js");
const Guild = require("../../schemas/guildSchema");
const { MessageAttachment } = require("discord.js");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("messages")
    .setDescription("Visualize the messages sent over time in the server"),

  async execute(interaction) {
    // Fetch all GuildUser documents
    const guild = await Guild.findOne({ guildId: interaction.guild.id });

    // Combine all messagesSent arrays into a single array
    let allMessages = guild.messagesSent;

    // Sort the array by timestamp
    allMessages.sort((a, b) => a.timestamp - b.timestamp);

    // Prepare data for the chart
    const groupedMessages = allMessages.reduce((acc, message) => {
      const date = new Date(message.time);
      const day = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`; // Format as YYYY-MM-DD
      if (!acc[day]) acc[day] = 0;

      acc[day] += 1; // Increment the count for this day

      return acc;
    }, {});

    const labels = Object.keys(groupedMessages);
    const data = Object.values(groupedMessages);

    // Create the chart
    const width = 1920;
    const height = 1080;

    const chartCallback = (ChartJS) => {
      ChartJS.defaults.animation = false;
      ChartJS.defaults.responsive = false;
      ChartJS.defaults.maintainAspectRatio = false;
      ChartJS.defaults.devicePixelRatio = 1;
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height,
      chartCallback,
    });
    const configuration = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Messages sent over time",
            data: data,
            backgroundColor: "rgba(75, 192, 192, 0.75)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
        backgroundColor: "white",
        plugins: {
          backgroundColor: "white",
        },
      },
    };
    const [image] = await Promise.all([
      chartJSNodeCanvas.renderToBuffer(configuration),
    ]);

    const fs = require("fs");
    fs.writeFileSync("chart.png", image);

    await interaction.reply({ files: ["chart.png"] });
  },
};
