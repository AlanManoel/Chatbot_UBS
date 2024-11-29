const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { uploadToGemini, waitForFilesActive } = require('../useCase/sendFile.js');
const { run } = require('../useCase/sendMessageToAI.js');
const fs = require('fs');
const path = require('path');
const sendBulkMessage = require("../useCase/sendAutomaticMessage.js")

const saveNumber = (number) => {
  const numbersFile = path.resolve(__dirname, "..", "numbers.txt");

  fs.readFile(numbersFile, "utf-8", (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error("Error reading file:", err);
      return;
    }

    if (!data || !data.includes(number)) {
      fs.appendFile(numbersFile, number + "\n", (err) => {
        if (err) {
          return console.log(err);
        } else {
          console.log(`Number: ${number} was saved!`)
        }
      });
    } else {
      console.log(`Number ${number} is already saved!`);
    }
  });
}

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
    const uploadedFile = await uploadToGemini("DadosSF.pdf", "application/pdf");
    await waitForFilesActive([uploadedFile]);
    fs.writeFile(path.resolve(__dirname, "..", "data.txt"), `${uploadedFile.mimeType}\n${uploadedFile.uri}`, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  } catch (error) {
    console.error("Erro ao carregar o arquivo PDF:", error);
  }
});

client.on('message_create', async message => {
  if (message.fromMe) return;
  const senderNumber = message.from;

  saveNumber(senderNumber);

  console.log(message.body);
  if (message.body === "/ok") {
    sendBulkMessage(client);
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
