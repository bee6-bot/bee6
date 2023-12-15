const clc = require("cli-color");
const config = require("../../config.js");

function logBotInfo(logger, client) {
  logger.info(
    `Logged in as ${clc.green(client.user.tag)}` +
      `\n\tID: ${clc.green(client.user.id)}` +
      `\n\tGuilds: ${clc.green(client.guilds.cache.size)}`,
  );
}

function setPresence(client) {
  const placeholders = {
    guilds: client.guilds.cache.size,
    users: client.users.cache.size,
    channels: client.channels.cache.size,
    version: config.bot.version,
    name: config.bot.name,
    uptime: client.uptime,
    ping: client.ws.ping,
  };

  let presence =
    config.bot.presence.list[
      Math.floor(Math.random() * config.bot.presence.list.length)
    ];

  presence.text = presence.text.replace(
    /\{\{(\w+)}}/g,
    (match, p1) => placeholders[p1],
  );

  client.user.setPresence({
    activities: [{ name: presence.text, type: presence.type }],
  });
}

module.exports = {
  name: `ready`,
  once: true,
  async execute(client) {
    logBotInfo(client.logger, client);

    // Set presence
    if (config.bot.presence.enabled) {
      client.logger.info(
        `Setting presence every ${config.bot.presence.interval}ms`,
      );
      setPresence(client);
      setInterval(() => setPresence(client), config.bot.presence.interval);
    }
  },
};
