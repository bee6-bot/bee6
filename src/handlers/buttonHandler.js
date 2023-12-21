"use strict";

require("dotenv").config();
const btnLogger = require("bunyan").createLogger({ name: "buttonHandler" });
const path = require("path");
const { readdirSync } = require("fs");
const fs = require("fs");

/**
 * Loads and registers buttons for the Discord bot.
 * @param {import("discord.js").Client} client - The Discord client instance.
 */
module.exports = async (client) => {
  const buttonPath = path.join(__dirname, "../buttons");

  ensureButtonDirectoryExists(buttonPath);

  const buttonsList = retrieveButtonsFromDirectories(buttonPath, client);

  if (buttonsList.length > 0)
    btnLogger.info(`Loaded ${buttonsList.length} buttons.`);
  else btnLogger.warn("No buttons found.");
};

/**
 * Ensures the button directory exists.
 * @param {string} buttonPath - The path to the button directory.
 */
function ensureButtonDirectoryExists(buttonPath) {
  if (!fs.existsSync(buttonPath)) fs.mkdirSync(buttonPath);
}

/**
 * Retrieves a list of buttons from the button directory and its subdirectories.
 * @param {string} buttonPath - The path to the button directory.
 * @param {import("discord.js").Client} client - The Discord client instance.
 * @returns {Array} - The list of buttons.
 */
function retrieveButtonsFromDirectories(buttonPath, client) {
  const buttonsList = [];
  const items = readdirSync(buttonPath, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      const subDirPath = path.join(buttonPath, item.name);
      buttonsList.push(...retrieveButtonsFromDirectories(subDirPath, client));
    } else if (item.isFile() && item.name.endsWith(".js")) {
      const button = require(path.join(buttonPath, item.name));
      client.buttons.set(button.name, button);
      buttonsList.push(button);
    }
  }

  return buttonsList;
}
