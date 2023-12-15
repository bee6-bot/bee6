# Configuring the bot

## Configuration file

The bot is configured with a JavaScript file, `config.js`, which is loaded by the bot when it starts. This file is not
included in the repository and should not be committed to a repository, due to the sensitive information it contains.
Instead, a template file, `config.template.js`, is included, which can be copied and renamed to `config.js`, and then
filled in with the appropriate information.

## Configuration options

### `bot`

- `name` `string` The name of the bot. Used when referring to the bot in messages.
- `about` `string` A short description of the bot. Used in the [`botInfo`](../src/commands/miscCommands/botInfo.js) command.
- `token` `string` The token of the bot. You can get this from
  the [Discord developer portal](https://discord.com/developers/applications).
- `id` `string` The ID of the bot. You can get this from
  the [Discord developer portal](https://discord.com/developers/applications).
- `version` `string` The version of the bot. Used when referring to the bot in messages.
- `developers` `string[]` The IDs of the bot developers. Can be used to determine who can use the priveleged commands.
- `owners` `string[]` The IDs of the bot owners. Can be used to determine who can use the very priveleged commands.

#### `presence`

- `enabled` `boolean` Whether to show the bot's presence.
- `interval` `number` The interval, in milliseconds, between presence changes.
- `list` `string[]` The list of presences to cycle through. You can also use a series of variables to make your presences
  more dynamic. See the [Presence variables](#presence-variables) section for more information.

### `intents`

- `list` `string[]` The intents to use. See the [Discord.js docs](https://discord.com/developers/docs/topics/gateway#list-of-intents)
  for more information. You can also use the `GatewayIntentBits` enum to make this easier.

### `git`

- `enabled` `boolean` Whether to show Git information in the `info` command, and to allow the `update` command.
- `repo` `string` The repository URL. Used when showing Git information in the `info` command.
- `branch` `string` The branch name. Used when showing Git information in the `info` command.

### `blacklist`

- `enabled` `boolean` Whether to use the blacklist.
- `users` `string[]` The IDs of the blacklisted users.
- `guilds` `string[]` The IDs of the blacklisted guilds.

### `logging`

- `enabled` `boolean` Whether to use logging.
- `level` `string` The logging level. See [Bunyan's README](https://github.com/trentm/node-bunyan#levels)
- `filePath` `string` The path to the log file.

# Presence variables

The following variables can be used in the presence list:

- `{{guilds}}` The number of guilds the bot is in.
- `{{users}}` The number of users the bot can see.
- `{{channels}}` The number of channels the bot can see.
- `{{version}}` The version of the bot.
- `{{name}}` The name of the bot.
- `{{uptime}}` The uptime of the bot.
- `{{ping}}` The bot's ping.
