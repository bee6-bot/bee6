// If the message mentions the bot, reply
const config = require("../../../config");
const axios = require("axios");

/**
 * Splits a message into an array of messages, each with a maximum length of 2000 characters
 * @param message
 */
function messageSplit(message) {
  if (message.length <= 2000) return [message];

  const messages = [];
  let currentMessage = "";

  for (let i = 0; i < message.length; i++) {
    if (currentMessage.length >= 2000) {
      messages.push(currentMessage);
      currentMessage = "";
    }

    currentMessage += message[i];
  }

  if (currentMessage.length > 0) messages.push(currentMessage);

  return messages;
}

async function fetchReply(message) {
  return await message.channel.messages.fetch(message.reference.messageId);
}

async function aiMessage(client, message) {
  if (message.mentions.has(client.user.id)) {
    let typingInterval = setInterval(() => {
      message.channel.sendTyping();
    }, 9000);
    let chatHistory = []; // Form a message history for each participant, { role: "user" | "assistant", message: string }[]
    let lastMessage = message;

    // Fetch the message history
    for (let i = 0; i < config.ai.historyLimit; i++) {
      try {
        lastMessage = await fetchReply(lastMessage);
        if (lastMessage.author.bot)
          chatHistory.push({
            role: "assistant",
            content: lastMessage.content,
          });
        else
          chatHistory.push({
            role: "user",
            content: `${lastMessage.author.displayName} says ${lastMessage.content}`,
          });
      } catch (err) {
        break;
      }
    }

    chatHistory.push({ role: "system", content: config.ai.systemPrompt });

    chatHistory.reverse(); // Reverse the array so that the oldest message is first
    chatHistory.push({ role: "user", content: message.content });

    if (config.ai.openrouter.enabled) {
      fetch(`${config.ai.openrouter.url}/api/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.ai.openrouter.token}`,
          "Content-Type": "application/json",
          "X-Title": `${config.bot.name} Discord Bot`,
        },
        body: JSON.stringify({
          model: config.ai.openrouter.defaultModel,
          messages: chatHistory,
        }),
      })
        .then((res) => res.json())
        .then(async (json) => {
          // Split the message into multiple messages if it exceeds the character limit
          const messages = messageSplit(json.choices[0].message.content);
          let lastBotMessage = null;

          // Send the messages
          for (const response of messages) {
            if (lastBotMessage)
              lastBotMessage = await lastBotMessage.reply({
                content: response,
                allowedMentions: { repliedUser: false },
              });
            else
              lastBotMessage = await message.reply({
                content: response,
                allowedMentions: { repliedUser: false },
              });
          }

          clearInterval(typingInterval);
        })
        .catch((err) => {
          console.error(err);
          message.reply({
            content: `:x: An error occurred while processing your request.`,
          });
        });
    } else if (config.ai.local.enabled) {
      // Form the data object
      const data = {
        model: config.ai.defaultModel,
        messages: chatHistory,
      };

      // Send the request to the API
      const options = {
        method: "post",
        url: "http://localhost:11434/api/chat",
        data,
        responseType: "stream",
      };

      // Send the request
      const botMessage = await message.reply({
        content:
          `:thinking: Thinking...` + `\n\n**Note:** ${config.ai.local.note}`,
      });
      let responseText = ``;
      let wordCount = 0;
      message.channel.sendTyping();

      try {
        axios(options)
          .then((response) => {
            response.data.on("data", (chunk) => {
              const responsePart = JSON.parse(chunk);

              if (!responsePart.done) {
                responseText += responsePart.message.content;
                wordCount += responsePart.message.content.split(" ").length;

                if (wordCount >= 10) {
                  wordCount = 0;
                  botMessage.edit({ content: `${responseText}` });
                }
              } else {
                botMessage.edit({ content: `${responseText}` });
                clearInterval(typingInterval);
              }
            });
          })
          .catch((error) => {
            console.error(error);
            botMessage.edit({
              content: `:x: An error occurred while processing your request.`,
            });
            clearInterval(typingInterval);
          });
      } catch (err) {
        console.error(err);
        botMessage.edit({
          content: `:x: An error occurred while processing your request.`,
        });
      }
    }
  }
}

module.exports = aiMessage;
