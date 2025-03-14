const { Client, LocalAuth, MessageTypes } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { uploadToGemini, waitForFilesActive } = require('../useCase/sendFile.js');
const { run } = require('../useCase/sendMessageToAI.js');
const fs = require('fs');
const path = require('path');
const { sendAutomaticMessage } = require("../useCase/sendAutomaticMessage.js");
const { saveNumber } = require("../useCase/saveNumber.js");
const messages = require("../messages/infoMessage.js");
const { findUser } = require("../useCase/findUser.js");
const { updateFeedback } = require('../useCase/updateFeedback.js');
const { saveNewFile } = require('../useCase/saveNewFile.js');
const { console } = require('inspector');

const feedbackRequests = {};

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('O cliente está pronto!');

  try {
    const uploadedFile = await uploadToGemini("./docs/DadosSF.pdf", "application/pdf");
    await waitForFilesActive([uploadedFile]);
    fs.writeFile(path.resolve(__dirname, "..", "data.txt"), `${uploadedFile.mimeType}\n${uploadedFile.uri}`, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("O arquivo foi salvo!");
    });
  } catch (error) {
    console.error("Erro ao carregar o arquivo PDF:", error);
  }
});

client.on('message_create', async message => {
  if (message.fromMe) return;
  const senderNumber = message.from;
  const user = await findUser(senderNumber);

  if (!user) {
    if (!global.pendingRegistrations) {
      global.pendingRegistrations = {};
    }

    if (!global.pendingRegistrations[senderNumber]) {
      global.pendingRegistrations[senderNumber] = true;
      await message.reply(messages.MESSAGE_GREETING);
      client.sendMessage(senderNumber, messages.LGPD_CONSENT_MESSAGE);

      const consentListener = async (consentMessage) => {
        if (consentMessage.from === senderNumber && global.pendingRegistrations[senderNumber]) {
          const consentResponse = consentMessage.body.trim().toUpperCase();
          if (consentResponse === '1' || consentResponse === "SIM") {
            client.sendMessage(senderNumber, messages.MESSAGE_ASKNAME);

            const nameListener = async (nameMessage) => {
              if (nameMessage.from === senderNumber && global.pendingRegistrations[senderNumber]) {
                const userName = nameMessage.body.trim();

                await saveNumber(userName, senderNumber);
                await nameMessage.reply(`Prazer em conhecê-lo(a), ${userName}!\n${messages.MESSAGE_INTRO}`);

                delete global.pendingRegistrations[senderNumber];
                client.removeListener('message_create', nameListener);
              }
            };

            client.on('message_create', nameListener);
          } else if (consentResponse === '0' || consentResponse === "NÃO") {
            await saveNumber(senderNumber, senderNumber);
            await consentMessage.reply(messages.MESSAGE_INTRO);

            delete global.pendingRegistrations[senderNumber];
          } else {
            await consentMessage.reply(messages.MESSAGE_INVALID_RESPONSE);
            return;
          }

          client.removeListener('message_create', consentListener);
        }
      };

      client.on('message_create', consentListener);
    }
  } else {
    if (feedbackRequests[senderNumber] === "feedbackPending" && message.body) {
      const rating = parseInt(message.body.trim(), 10);

      if (rating >= 1 && rating <= 5) {
        await message.reply(messages.EVALUATION_CONFIRMATION_MESSAGE);
        feedbackRequests[senderNumber] = "feedbackCompleted";
        await updateFeedback(user, rating);
        return;
      } else {
        await message.reply(messages.REQUEST_RATING_MESSAGE);
        return;
      }
    }
    if (message.body === "comandos" && senderNumber === process.env.NUMBER_ADM) {
      await message.reply(messages.MESSAGE_COMMAND);
      return;
    }

    if (message.body === "/enviarInformativo" && senderNumber === process.env.NUMBER_ADM) {
      await message.reply(messages.MESSAGE_REQUEST);

      client.once("message", async (infoMessage) => {
        const info = infoMessage.body;
        await sendAutomaticMessage(client, info);
        await infoMessage.reply(messages.MESSAGE_CONFIRMATION);
      });
    } else if (message.body === "/novoDocumento" && senderNumber == process.env.NUMBER_ADM) {
      await message.reply(messages.MESSAGE_NEW_DOCUMENT);
      client.once("message", async (media) => {
        if (media.hasMedia) {
          const docs = await media.downloadMedia();
          try {
            await saveNewFile(docs);
            await message.reply(messages.MESSAGE_DOCUMENT_SAVED);
          } catch (error) {
            await message.reply(messages.MESSAGE_DOCUMENT_ERROR);
          }
        }
      });

    } else {
      if (message.body) {
        const chat = await client.getChatById(senderNumber); //Status digitando
        chat.sendStateTyping();

        const result = await run(message.body);

        try {
          await message.reply(result.trim());
          setTimeout(async () => {
            if (!feedbackRequests[senderNumber] && !user.avaliacao) {
              await message.reply(messages.EVALUATION_REQUEST_MESSAGE);
              feedbackRequests[senderNumber] = "feedbackPending";
            }
          }, 90000);
        } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
        }
      }
    }
  }
});

module.exports = { client }
