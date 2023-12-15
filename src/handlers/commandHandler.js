"use strict";

require("dotenv").config();
const { REST, Routes } = require("discord.js");
const cmdLogger = require("bunyan").createLogger({ name: "commandHandler" });
const path = require("path");
const { readdirSync } = require("fs");
const fs = require("fs");

const config = require("../../config");
const token = config.bot.token;
const rest = new REST({ version: "9" }).setToken(token);

/**
 * Loads and registers commands for the Discord bot.
 * @param {import("discord.js").Client} client - The Discord client instance.
 */
module.exports = async (client) => {
  const commandPath = path.join(__dirname, "../commands");

  ensureCommandDirectoryExists(commandPath);

  const commandsList = retrieveCommandsListFromDirectories(commandPath, client);

  if (commandsList.length > 0) await registerCommands(client, commandsList);
  else cmdLogger.warn("No commands found.");
};

/**
 * Ensures the existence of the command directory; creates it if not present.
 * @param {string} commandPath - The path to the command directory.
 */
const ensureCommandDirectoryExists = (commandPath) => {
  if (fs.existsSync(commandPath))
    return cmdLogger.info("Commands directory exists.");
  cmdLogger.warn("Commands directory does not exist. Creating it now...");
  fs.mkdirSync(commandPath);
};

/**
 * Retrieves a list of commands from directories.
 * @param {string} commandPath - The path to the command directory.
 * @param client
 * @returns {Object[]} - List of command data objects.
 */

const retrieveCommandsListFromDirectories = (commandPath, client) => {
  const commandDirs = readdirSync(commandPath);
  const commandsList = [];

  cmdLogger.info("Registering commands...");

  for (const dir of commandDirs) {
    if (!fs.lstatSync(path.join(commandPath, dir)).isDirectory()) continue;

    const fileNamesInDir = readdirSync(path.join(commandPath, dir));
    for (const fileName of fileNamesInDir) {
      if (!fileName.endsWith(".js")) continue;

      const command = require(path.join(commandPath, dir, fileName));
      if (!command.data) {
        cmdLogger.warn(
          `\tCommand ${fileName} does not have a data property. Skipping...`,
        );
        continue;
      }

      cmdLogger.info(`\tRegistered command ${command.data.name}`);

      commandsList.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
    }
  }

  return commandsList;
};

/**
 * Registers commands with Discord.
 * @param {import("discord.js").Client} client - The Discord client instance.
 * @param {Object[]} commandsList - List of command data objects.
 */
async function registerCommands(client, commandsList) {
  try {
    cmdLogger.info("Started refreshing application (/) commands.");

    const timeout = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(new Error("Command registration timed out after 30 seconds")),
        30_000,
      ),
    );

    await Promise.race([
      rest.put(Routes.applicationCommands(config.bot.id), {
        body: commandsList,
      }),
      timeout,
    ]);

    cmdLogger.info(`\tSuccessfully reloaded application (/) commands.`);
  } catch (e) {
    cmdLogger.error(`\tError refreshing application (/) commands: ${e}`);
    cmdLogger.error(e);
  }
}
