# src/handlers

> This is the documentation for the `handlers/` directory.

This directory handles the loading and execution of commands and events.

## Command handler

[Jump to File](./commandHandler.js)

This module is utilized to manage the loading, registration, and execution of slash command. It checks for the existence
of a command directory, retrieves commands from that directory, and registers
them with Discord API endpoints.

### Functions

- `ensureCommandDirectoryExists`

  - Purpose: Checks if the directory for storing commands exists, creates it if absent.
  - Parameters: commandPath (String) - Path to the directory storing commands.

- `retrieveCommandsListFromDirectories`

  - Purpose: Retrieves a list of commands from directories, registering them for use.
  - Parameters: commandPath (String) - Path to the directory storing commands.
  - Returns: An array of command objects retrieved from the directories.

- `registerCommands`
  - Purpose: Registers the commands in the Discord application.
  - Parameters:
    - client (Client) - The Discord bot client instance.
    - commandsList (Array) - List of command objects to register.

## Event Handler

[Jump to File](./eventHandler.js)

This module is utilized to manage the loading and execution of events. It checks for the existence of an event
directory,
retrieves events from that directory, and "registers" them with the client using the `client.on[ce]` methods.

### Functions

- `ensureEventDirectoryExists`

  - Purpose: Checks if the directory for storing events exists, creates it if absent.
  - Parameters: eventPath (String) - Path to the directory storing events.

- `retrieveEventsListFromDirectories`

  - Purpose: Retrieves a list of events from directories, registering them for use.
  - Parameters: eventPath (String) - Path to the directory storing events.
  - Returns: An array of event objects retrieved from the directories.

- `registerEvents`

  - Purpose: Registers the events in the Discord client.
  - Parameters:
    - client (Client) - The Discord bot client instance.
    - eventsList (Array) - List of event objects to register.

[client]: https://discord.js.org/docs/packages/core/0.5.0/Client:Class
