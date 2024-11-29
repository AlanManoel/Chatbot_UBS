const fs = require('fs');

async function sendBulkMessage(client) {
    const fileData = await fs.promises.readFile("numbers.txt", "utf-8");
    const numbers = fileData.split("\n").map(number => number.trim()).filter(Boolean);
    const messageText = 'Olá! Esta é uma mensagem automatizada.';
    for (const number of numbers) {
      try {
        await client.sendMessage(number, messageText);
        console.log(`Mensagem enviada para: ${number}`);
      } catch (error) {
        console.error(`Erro ao enviar para ${number}:`, error);
      }
    }
  }

module.exports = sendBulkMessage;