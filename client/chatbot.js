const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { uploadToGemini, waitForFilesActive } = require('../useCase/sendFile.js');
const { run } = require('../useCase/sendMessageToAI.js');
const fs = require('fs');
const path = require('path');
const sendBulkMessage = require("../useCase/sendAutomaticMessage.js");
const saveNumberJS = require("../useCase/saveNumber.js");
const messages = require("../messages/infoMessage.js")

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

  saveNumberJS(senderNumber);

  console.log(message.body);
  if (message.body === "/enviarInformativo" && senderNumber === "558694575010@c.us") {
    await message.reply(messages.MESSAGE_REQUEST);

    client.once("message", async (infoMessage) => {
      const info = infoMessage.body;
      await sendBulkMessage(client, info);
      await infoMessage.reply(messages.MESSAGE_CONFIRMATION);
    });

  } else {
    if (message.body) {
      const result = await run(message.body);
      console.log(result);

      try {
        await message.reply(result);
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    }
  }

});

module.exports = { client }
