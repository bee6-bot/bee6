/**
 * Connects to the database.
 * @param {object} config - The configuration object.
 */

const mongoose = require("mongoose");
const dbLogger = require("bunyan").createLogger({ name: "dbHandler" });

module.exports = async (config) => {
  if (!config.database.enabled) return;

  dbLogger.info("Connecting to database...");

  const options = {
    dbName: config.database.name,
    user: config.database.auth.enabled
      ? config.database.auth.username
      : undefined,
    pass: config.database.auth.enabled
      ? config.database.auth.password
      : undefined,
  };

  mongoose.connection.on("connected", () => {
    dbLogger.info("Mongoose connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    dbLogger.error("Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    dbLogger.info("Mongoose disconnected");
  });

  // Exit application on error
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      dbLogger.info("Mongoose disconnected through app termination");
      process.exit(0);
    });
  });

  try {
    await mongoose.connect(config.database.url, options);
    dbLogger.info("\tConnected to database!");
  } catch (error) {
    dbLogger.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
