/**
 * @file initHandlers.js
 * @description Initializes handlers, such as commands abd events.
 */

// Import handlers
const loadCommands = require("./commandHandler.js");
const loadEvents = require("./eventHandler.js");
const { Collection } = require("discord.js");

module.exports = async (client) => {
  client.commands = new Collection();
  client.aliases = new Collection();
  client.events = new Collection();
  client.buttons = new Collection();
  client.modals = new Collection();

  await loadCommands(client);
  await loadEvents(client);
};
