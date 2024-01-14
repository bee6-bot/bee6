/**
 * @file initHandlers.js
 * @description Initializes handlers, such as commands abd events.
 */

// Import handlers
const loadCommands = require("./commandHandler.js");
const loadEvents = require("./eventHandler.js");
const loadButtons = require("./buttonHandler");
const loadModals = require("./modalHandler");
const dbHandler = require("./db.js");

const config = require("../../config.js");
const { Collection } = require("discord.js");

module.exports = async (client) => {
  client.modals = new Collection(); // not used
  client.aliases = new Collection(); // not used
  client.commands = new Collection();
  client.events = new Collection();
  client.buttons = new Collection();

  await loadCommands(client);
  await loadEvents(client);
  await loadButtons(client);
  await loadModals(client);
  await dbHandler(config);
};
