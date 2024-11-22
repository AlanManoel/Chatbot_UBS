const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { uploadToGemini, waitForFilesActive } = require('../useCase/sendFile.js');

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
    } catch (error) {
      console.error("Erro ao carregar o arquivo PDF:", error);
    }
  });
  
  
  client.on('message_create', async message => {
      if (message.fromMe) return;
    
      console.log(message.body);
    
      if (message.body) {
        const result = await run(message.body);
        console.log(result); 
    
        try {
          // client.sendMessage(message.from, 'pong'); // Para mandar mensagem pra si mesmo no WhatsApp
          await message.reply(result); 
        } catch (error) {
          console.error("Erro ao enviar mensagem:", error);
        }
      }
    });


module.exports = {client}