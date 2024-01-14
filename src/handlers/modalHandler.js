"use strict";

require("dotenv").config();
const modalLogger = require("bunyan").createLogger({ name: "modalHandler" });
const path = require("path");
const { readdirSync } = require("fs");
const fs = require("fs");

/**
 * Loads and registers modals
 * @param {import("discord.js").Client} client - The Discord client instance.
 * @returns {Promise<void>}
 */
module.exports = async (client) => {
  const modalPath = path.join(__dirname, "../modals");

  ensureModalDirectoryExists(modalPath);

  const modalFiles = retrieveModalFilesFromDirectory(modalPath);

  if (modalFiles.length > 0) registerModals(client, modalFiles);
  else modalLogger.warn("No modals found.");
};

/**
 * Ensures the existence of the modal directory; creates it if not present.
 * @param {string} modalPath - The path to the modal directory.
 */
function ensureModalDirectoryExists(modalPath) {
  if (fs.existsSync(modalPath))
    return modalLogger.info("Modlas directory exists.");
  modalLogger.warn("Modals directory does not exist. Creating it now...");
  fs.mkdirSync(modalPath);
}

/**
 * Retrieves a list of modal files from a directory.
 * @param {string} modalPath - The path to the modal directory.
 * @returns {string[]} - List of modal file names.
 */
function retrieveModalFilesFromDirectory(modalPath) {
  const modalFiles = readdirSync(modalPath);
  return modalFiles.filter((file) => file.endsWith(".js"));
}

/**
 * Registers modals with the Discord client.
 * @param {import("discord.js").Client} client - The Discord client instance.
 * @param {string[]} modalFiles - List of modal file names.
 */
function registerModals(client, modalFiles) {
  modalLogger.info("Registering modals...");

  for (const file of modalFiles) {
    const modal = require(path.join(__dirname, "../modals", file));
    const modalName = modal.name;
    modalLogger.info(`\tRegistered modal ${modalName}`);
    client.modals.set(modalName, modal);
  }
}
