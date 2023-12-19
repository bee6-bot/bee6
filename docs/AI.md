# Artificial Intelligence

BEE6 has the ability to communicate with AI models hosted through [Ollama](https://ollama.ai/), a quick, easy-to-use
way to locally host AI models. This allows BEE6 to use AI models without having to send data to third-party servers.

## Setting up

1. Go to the [Ollama website](https://ollama.ai/) download the software.
2. Then, install a model. You can find a list of models [here](https://ollama.ai/models). A good entry-level model would be
   [orca-mini](https://ollama.ai/library/orca-mini), only requiring 8 gigabytes of RAM, but with fairly good results.
   - You can do this by running `ollama pull <modal name>` in your terminal.
3. Once a model is installed, you can start the server by running `ollama serve`.
4. You can now use the model in BEE6 by setting `ai.defaultModel` to the model name in `config.js`.
