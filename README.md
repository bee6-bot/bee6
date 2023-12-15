# discordjs-template

> A cool template to jumpstart your discord.js bot!

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20.0.0 or higher)
- [Git](https://git-scm.com/downloads)
- A code editor
- A Discord bot token

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/beauthebeau/discordjs-template.git
   ```

2. Install NPM packages

   ```sh
   npm ci
   ```

3. Copy `config.example.json` to `config.json` and fill in the values
   See [configuring the bot](docs/CONFIG.md) for more information.

   ```sh
   cp config.example.json config.json
   ```

4. Start the bot
   ```sh
   npm start
   ```

## Documentation

See [docs](docs/README.md) for more information.

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

Your code should be formatted automatically on commit using [Prettier](https://prettier.io/), but if not,
you can run `npm run format` to format your code. It will also be formatted when you make a pull request.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
