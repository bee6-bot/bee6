# src/events

> This is the documentation for the events directory.

This directory handles all the events that are emitted by the bot. The events are emitted by the [client].
Events are registered and executed by the [eventHandler](../handlers/eventHandler.js).

## Creating a new event

To create a new event, create a new file in this directory. The file name should be the name of the event. For example,
if you want to handle the `messageCreate` event, the file name should be `messageCreate.js`. The file should export the
`name`, `once` and `execute` properties. Where `name` is the name of the event, `once` is a boolean that indicates if
the
event should only be executed once and `execute` is the function that will be executed when the event is emitted.

### Example

```js
module.exports = {
  name: "messageCreate",
  once: false,
  execute(client, message) {
    client.logger.info(`Message received: ${message.content}`);
  },
};
```

## List of events

Discord.js has a helper enum, [`Events`][events], that contains all the events that can be emitted by the client.

### Example

```js
const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute(client, message) {
    client.logger.info(`Message received: ${message.content}`);
  },
};
```

### Privileged intents

Some events require privileged intents to be enabled. You can enable them in the [Discord Developer Portal][portal].

- `GUILD_MEMBERS` required the **`GuildMembers`** intent.
- To access the content of messages, you need the **`MessageContent`** intent
- To receive **Presence Updates**, you need the **`GuildPresences`** intent.

For more information about intents, see the [Discord.js Guide][privileged intents].

[privileged intents]: https://discordjs.guide/popular-topics/intents.html#privileged-intents
[portal]: https://discord.com/developers/applications
[client]: https://discord.js.org/docs/packages/core/0.5.0/Client:Class
[events]: https://discord.js.org/docs/packages/discord.js/main/Events:Enum
