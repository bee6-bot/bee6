# Artificial Intelligence

BEE6 has the ability to communicate with AI models hosted through [Ollama](https://ollama.ai/), a quick, easy-to-use
way to locally host AI models. This allows BEE6 to use AI models without having to send data to third-party servers.

BEE6 can also use AI models through [OpenRouter](https://openrouter.ai/).

If `ai.openrouter.enabled` is set to `true` in `config.js`, BEE6 will use OpenRouter instead of Ollama.

## Setting up

### Ollama

1. Go to the [Ollama website](https://ollama.ai/) download the software.
2. Then, install a model. You can find a list of models [here](https://ollama.ai/models). A good entry-level model would be
   [orca-mini](https://ollama.ai/library/orca-mini), only requiring 8 gigabytes of RAM, but with fairly good results.
   - You can do this by running `ollama pull <modal name>` in your terminal.
3. Once a model is installed, you can start the server by running `ollama serve`.
4. You can now use the model in BEE6 by setting `ai.defaultModel` to the model name in `config.js`.

### OpenRouter

1. Go to the [OpenRouter website](https://openrouter.ai/) and create an account.
2. Create an API key by going to the [tokens page](https://openrouter.ai/keys).
3. Set the values in `config.ai.openrouter` to the values you got from the previous step.
4. You can now use the model in BEE6 by setting `ai.openrouter.enabled` to `true` in `config.js`.
