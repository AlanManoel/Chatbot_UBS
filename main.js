require('dotenv').config();

const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const informacoes = `Sou a UBS do bairro São Francisco. 
Atendo de segunda a sexta-feira.
conto com uma equipe formada por médicos e dentistas.`;


async function gerarConteudo(prompt) {
  try {
    // const result = await model.generateContent(prompt);
    // return (result.response.text()); 
    const result = await model.generateContent(`
      Responda apenas com base nas seguintes informações: 
      ${informacoes}
      
      Pergunta: ${prompt}`);
    return result.response.text(); 
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    return "Desculpe, houve um erro ao gerar a resposta.";
  }
}

const client = new Client();

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message_create', async message => {
    if (message.fromMe) return;
  
    console.log(message.body);
  
    if (message.body) {
      const result = await gerarConteudo(message.body); 
      console.log(result); 
  
      try {
        await message.reply(result); 
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    }
  });

client.initialize();
