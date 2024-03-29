/**
 * @file index.js
 * @description Entry point for the Discord bot.
 * This file initializes the bot and sets up logging functionalities.
 */

// Dependencies
let config;
const { Client, GatewayIntentBits } = require("discord.js");
const bunyan = require("bunyan");
const path = require("path");
require("dotenv").config();

// Check if config.js exists
try {
  config = require("./../config.js");
} catch (err) {
  if (err.code === "MODULE_NOT_FOUND")
    console.error(
      "config.js not found! Please rename config.example.js to config.js and fill in the values.",
    );
  else {
    console.error("Error while loading config.js!");
    console.error(err);
  }

  console.error("Exiting...");
  process.exit(1);
}

// Client & Logger setup
const logger = setupLogger();
let client;

// Initialize the client and data structures
setupClientAndData()
  .then((c) => {
    client = c;
    logger.info("Client initialized!");
  })
  .catch((err) => {
    logger.error("Error while initializing client!");
    logger.error(err);
    process.exit(1);
  });

/**
 * Sets up the Discord bot client and initializes necessary data structures.
 * @returns {import("discord.js").Client} - The initialized Discord client.
 */
async function setupClientAndData() {
  const client = new Client({
    intents: config.intents.all
      ? Object.values(GatewayIntentBits).reduce((a, b) => a | b, 0)
      : config.intents.list,
    allowedMentions: config.allowedMentions || {
      parse: ["users", "roles"],
      repliedUser: true,
    },
  });

  /**
   * Loads various handlers for the bot (commands, events, etc).
   * @param {import("discord.js").Client} client - The Discord client instance.
   */
  const loadHandlers = require("./handlers/initHandlers.js");
  await loadHandlers(client);

  client.logger = logger;

  // Login
  await client.login(config.bot.token);
  return client;
}

/**
 * Sets up the logger for the bot.
 * @returns {import("bunyan").Logger} - The configured logger instance.
 */
function setupLogger() {
  return bunyan.createLogger({
    name: "discord-bot",
    streams: [
      { level: config.logging.level || "info", stream: process.stdout },
      {
        level: "error",
        path:
          config.logging.filePath || path.join(__dirname, "./logs/errors.log"),
      },
    ],
  });
}

module.exports = { client, logger };

process.on("unhandledRejection", (err) => {
  logger.error(err);
});

process.on("uncaughtException", (err) => {
  logger.error(err);
});
