const eventLogger = require("bunyan").createLogger({ name: "eventHandler" });
const config = require("./../../config");

let cooldowns = new Map();

module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    // Check if the guild/user is blacklisted
    if (config.blacklist.enabled) {
      if (config.blacklist.users.includes(interaction.user.id)) {
        return interaction.reply({
          content: "You are blacklisted from using this bot",
          ephemeral: true,
        });
      }
      if (config.blacklist.guilds.includes(interaction.guild.id)) {
        return interaction.reply({
          content: "This guild is blacklisted from using this bot",
          ephemeral: true,
        });
      }
    }

    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply({
          content: `Sorry, we couldn't find that command`,
          ephemeral: true,
        });

      /**
       * Check for command options (permissions, cooldown, etc.)
       */
      if (command.options) {
        // Check for permissions
        if (command.options.permissions) {
          if (command.options && command.options.permissions) {
            if (
              command.options.permissions.ownerOnly &&
              !config.owners.includes(interaction.user.id)
            ) {
              return interaction.reply({
                content: "You must be an owner to use this command",
                ephemeral: true,
              });
            }
            if (
              command.options.permissions.devOnly &&
              !config.developers.includes(interaction.user.id)
            ) {
              return interaction.reply({
                content: "You must be a developer to use this command",
                ephemeral: true,
              });
            }
          }
        }

        // Check for cooldown
        if (command.options.cooldown) {
          if (command.options.cooldown.enabled) {
            if (!cooldowns.has(command.name)) {
              cooldowns.set(command.name, new Map());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = command.options.cooldown.time * 1000;

            if (timestamps.has(interaction.user.id)) {
              const expirationTime =
                timestamps.get(interaction.user.id) + cooldownAmount;

              if (now < expirationTime) {
                return interaction.reply({
                  content: `You're on cooldown! The command will be available again <t:${Math.floor(
                    expirationTime / 1000,
                  )}:R>`,
                  ephemeral: true,
                });
              }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(
              () => timestamps.delete(interaction.user.id),
              cooldownAmount,
            );
          }
        }
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        eventLogger.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const button =
        client.buttons.get(interaction.customId.split("-")[0]) ||
        client.buttons.find(
          (button) => button.data.name === interaction.customId.split("-")[0],
        );
      if (!button)
        return interaction.reply({
          content: `Sorry, we couldn't find that button`,
          ephemeral: true,
        });

      try {
        await button.execute(client, interaction);
      } catch (error) {
        eventLogger.error(error);
        await interaction.reply({
          content: "There was an error while executing this button!",
          ephemeral: true,
        });
      }
    } else if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.respond({
          content: `Sorry, we couldn't find that command`,
          ephemeral: true,
        });

      if (command.autocomplete) {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          eventLogger.error(error);
          await interaction.respond({
            content: "There was an error while executing this autocomplete!",
            ephemeral: true,
          });
        }
      } else {
        interaction.respond({
          content: "This interaction is not supported",
          ephemeral: true,
        });
      }
    } else if (interaction.isModalSubmit()) {
      const modal =
        client.modals.get(interaction.customId.split("-")[0]) ||
        client.modals.find(
          (modal) => modal.data.name === interaction.customId.split("-")[0],
        );
      if (!modal)
        return interaction.reply({
          content: `Sorry, we couldn't find that modal`,
          ephemeral: true,
        });

      try {
        await modal.execute(client, interaction);
      } catch (error) {
        eventLogger.error(error);
        await interaction.reply({
          content: "There was an error while executing this modal!",
          ephemeral: true,
        });
      }
    } else {
      interaction.reply({
        content: "This interaction is not supported",
        ephemeral: true,
      });
    }
  },
};
