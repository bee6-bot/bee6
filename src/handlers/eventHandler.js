"use strict";

require("dotenv").config();
const eventLogger = require("bunyan").createLogger({ name: "eventHandler" });
const path = require("path");
const { readdirSync } = require("fs");
const fs = require("fs");

/**
 * Loads and registers events for the Discord bot.
 * @param {import("discord.js").Client} client - The Discord client instance.
 */
module.exports = async (client) => {
  const eventPath = path.join(__dirname, "../events");

  ensureEventDirectoryExists(eventPath);

  const eventFiles = retrieveEventFilesFromDirectory(eventPath);

  if (eventFiles.length > 0) registerEvents(client, eventFiles);
  else eventLogger.warn("No events found.");
};

/**
 * Ensures the existence of the event directory; creates it if not present.
 * @param {string} eventPath - The path to the event directory.
 */
const ensureEventDirectoryExists = (eventPath) => {
  if (fs.existsSync(eventPath))
    return eventLogger.info("Events directory exists.");
  eventLogger.warn("Events directory does not exist. Creating it now...");
  fs.mkdirSync(eventPath);
};

/**
 * Retrieves a list of event files from a directory.
 * @param {string} eventPath - The path to the event directory.
 * @returns {string[]} - List of event file names.
 */
const retrieveEventFilesFromDirectory = (eventPath) => {
  const eventFiles = readdirSync(eventPath);
  return eventFiles.filter((file) => file.endsWith(".js"));
};

/**
 * Registers events with the Discord client.
 * @param {import("discord.js").Client} client - The Discord client instance.
 * @param {string[]} eventFiles - List of event file names.
 */
function registerEvents(client, eventFiles) {
  eventLogger.info("Registering events...");

  for (const file of eventFiles) {
    const event = require(path.join(__dirname, "../events", file));
    const eventName = event.name;
    eventLogger.info(`\tRegistered event ${eventName}`);
    client.on(eventName, event.execute.bind(null, client));
  }
}
