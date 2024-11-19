require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const { GoogleGenerativeAI} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const qrcode = require('qrcode-terminal');

const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);
const fileManager = new GoogleAIFileManager(process.env.API_GEMINI);

async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Arquivo enviado ${file.displayName} as: ${file.name}`);
  return file;
}

async function waitForFilesActive(files) {
  console.log("Processando pdf...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name)
    }
    if (file.state !== "ACTIVE") {
      throw Error(`${file.name} falhou ao processar`);
    }
  }
  console.log("Arquivo está pronto\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Responda somente conforme as informações passadas",
});

const generationConfig = {
  temperature: 2,
  topP: 0,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  if (!uploadedFile) {
    throw new Error("Arquivo PDF não foi carregado!");
  }
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: uploadedFile.mimeType,
              fileUri: uploadedFile.uri,
            },
          },
          { text: "Responda apenas com base nas seguintes informações:" },
        ],
      },
    ],
  });
  const result = await chatSession.sendMessage(prompt);
  return (result.response.text());
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
    uploadedFile = await uploadToGemini("DadosSF.pdf", "application/pdf");
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

client.initialize();
