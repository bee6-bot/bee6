/**
 * @file config.example.js
 * @description Example config file for the bot. You should rename this file to config.js and fill in the values.
 * @see [CONFIG.md]{@link ./docs/CONFIG.md}
 */

const { ActivityType, GatewayIntentBits } = require("discord.js");
const { readFileSync } = require("fs");

/**
 * @typedef {Object} BotConfig
 * @property {string} name - The name of the bot.
 * @property {string} about - Brief description of the bot.
 * @property {string} token - The bot's token (to be filled in).
 * @property {string} id - The bot's ID (to be filled in).
 * @property {string} version - The version of the bot.
 * @property {string[]} developers - Array of developer user IDs.
 * @property {string[]} owners - Array of bot owner user IDs.
 */

/**
 * @typedef {Object} IntentsConfig
 * @property {boolean} all - Set to true to enable all intents, overrides `list`.
 * @property {number[]} list - Array of Gateway Intent Bits.
 */

/**
 * @typedef {Object} GitHubConfig
 * @property {boolean} enabled - Whether GitHub integration is enabled.
 * @property {string} repo - GitHub repository URL.
 * @property {string} branch - GitHub repository branch.
 */

/**
 * @typedef {Object} PresenceConfig
 * @property {boolean} enabled - Whether presence is enabled.
 * @property {number} interval - Interval, in milliseconds, between presence changes.
 * @property {Object[]} list - List of presences to cycle through.
 */

/**
 * @typedef {Object} BlacklistConfig
 * @property {boolean} enabled - Whether blacklist is enabled.
 * @property {string[]} users - Array of user IDs to be blacklisted.
 * @property {string[]} guilds - Array of guild IDs to be blacklisted.
 */

/**
 * @typedef {Object} LoggingConfig
 * @property {boolean} enabled - Whether logging is enabled.
 * @property {string} level - Logging level ('info', 'error', etc.).
 * @property {string} filePath - File path for logs.
 */

/**
 * @typedef {Object} DatabaseConfig
 * @property {boolean} enabled - Whether the database is enabled.
 * @property {string} url - MongoDB connection URL.
 * @property {string} name - MongoDB database name.
 * @property {Object} auth - Authentication details for the database.
 */

/**
 * @typedef {Object} WebConfig
 * @property {boolean} enabled - Whether the web server is enabled.
 * @property {number} port - Port for the web server.
 * @property {string} host - Host for the web server.
 */

/**
 * @typedef {Object} AIConfig
 * @property {number} historyLimit - Limit of AI conversation history.
 * @property {string} note - Note regarding AI behavior.
 * @property {string} systemPrompt - System prompt for AI (read from file).
 * @property {boolean} enabled - Whether AI is enabled.
 * @property {string} defaultModel - Default AI model.
 * @property {string} modelFriendlyName - Friendly name for the AI model.
 */

/**
 * @typedef {Object} OpenRouterConfig
 * @property {boolean} enabled - Whether OpenRouter integration is enabled.
 * @property {string} url - OpenRouter API URL.
 * @property {string} defaultModel - Default OpenRouter model.
 * @property {string} token - OpenRouter API token.
 */

/**
 * @type {BotConfig | IntentsConfig | GitHubConfig | PresenceConfig | BlacklistConfig
 *         | LoggingConfig | DatabaseConfig | WebConfig | AIConfig | OpenRouterConfig}
 */

const config = {};

// Core information
config.bot = {};
config.bot.name = "Discord Bot";
config.bot.about = "A bot for Discord";
config.bot.token = "";
config.bot.id = "";
config.bot.version = "0.0.1";
config.bot.developers = [];
config.bot.owners = [];

// Intents
//   See https://discord.com/developers/docs/topics/gateway#list-of-intents
//   & node_modules/discord-api-types/gateway/v10.d.ts
config.intents = {};
config.intents.all = false; // Set to true to enable all intents, overrides config.intents.list
config.intents.list = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
];

// GitHub information
config.github = {};
config.github.enabled = true;
config.github.repo = "https://github.com/username/repo";
config.github.branch = "master";

// Presence information
config.bot.presence = {};
config.bot.presence.enabled = true;
config.bot.presence.interval = 60 * 1000; // Interval, in milliseconds, between presence changes

// List of presences to cycle through
// Can use templates found in /src/events/ready.js, see the setPresence() function
config.bot.presence.list = [
  { type: ActivityType.Watching, text: "over {{guilds}} guilds" },
  { type: ActivityType.Listening, text: "to {{users}} users" },
  { type: ActivityType.Playing, text: "with {{channels}} channels" },
];

// IDs of users/guilds to be blacklisted from using the bot
config.blacklist = {};
config.blacklist.enabled = false;
config.blacklist.users = [];
config.blacklist.guilds = [];

// Logging configuration
config.logging = {};
config.logging.enabled = true;
config.logging.level = "info";
config.logging.filePath = "./logs/log.log";

// Database
// Using MongoDB
config.database = {};
config.database.enabled = true;
config.database.url = "mongodb://localhost:27017";
config.database.name = "bee6";

config.database.auth = {};
config.database.auth.enabled = false;
config.database.auth.username = "";
config.database.auth.password = "";

// Web server
config.web = {};
config.web.enabled = false;
config.web.port = 8080;
config.web.host = "localhost";

// AI
config.ai = {};
config.ai.historyLimit = 10;
config.ai.note =
  "As the conversation gets larger, the AI will take longer to respond.";
config.ai.systemPrompt = readFileSync("./systemPrompt.txt", "utf-8");

// For locally-hosted AI models
// See https://ollama.ai/
config.ai.enabled = true;
config.ai.defaultModel = "orca-mini";
config.ai.modelFriendlyName = "Orca Mini";

// For the OpenRouter API
// See https://openrouter.ai
config.ai.openrouter = {};
config.ai.openrouter.enabled = true;
config.ai.openrouter.url = "https://openrouter.dev";
config.ai.openrouter.defaultModel = "openrouter/auto"; // auto is recommended, for a full list of models see https://openrouter.ai/models
config.ai.openrouter.token = "";

module.exports = config;
