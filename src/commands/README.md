# src/commands

> This is the documentation for the commands directory.

This directory stores all the commands that the bot can execute. The commands are registered and executed by
the [commandHandler](../handlers/commandHandler.js).

## Creating a new command

To create a new command, find an appropriate directory to store the command in. If there is no appropriate directory,
just make a new one! Within the directory, create a new file. The file name should be the name of the command. For
example,
if you want to create a command called `ping`, the file name should be `ping.js`.

The file should export a `data` object, constructed with the [`SlashCommandBuilder`](slashCommandBuilder) class,
an `execute` function, which is the function that will be executed when the command is called, and optionally an
`options` object, which contains several other options.

### Example

```js
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),

  options: {
    permissions: { ownerOnly: false, devOnly: false }, // Anyone can use this command
    cooldown: { enabled: true, time: 5, global: false }, // 5 second cooldown, per user
  },

  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
```

## Command options

The `options` object can contain the following options:

- `permissions` `object`
  - `ownerOnly` `boolean` Whether only users in the `config.bot.owners` array can use the command.
  - `devOnly` `boolean` Whether only users in the `config.bot.developers` array can use the command.
- `cooldown` `object`
  - `enabled` `boolean` Whether the cooldown is enabled.
  - `time` `number` The cooldown time, in seconds.
  - `global` `boolean` Whether the cooldown is global. If it is, the cooldown will be shared between all users.
    **⚠️ Not yet implemented.**

[slashCommandBuilder]: https://discord.js.org/docs/packages/builders/main/SlashCommandBuilder:Class
