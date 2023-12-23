/**
 * @file config.example.js
 * @description Example config file for the bot. You should rename this file to config.js and fill in the values.
 * @see @{@link docs/CONFIG.md|CONFIG.md}
 */

const { ActivityType, GatewayIntentBits } = require("discord.js");
const { readFileSync } = require("fs");

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
