require('dotenv').config();

const { Client } = require('whatsapp-web.js');
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
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name)
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Responda somente conforme as informações passadas",
});

const generationConfig = {
  temperature: 1,
  topP: 0,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const files = [
    await uploadToGemini("DadosSF.pdf", "application/pdf"),
  ];
  await waitForFilesActive(files);

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
          {text: "Responda apenas com base nas seguintes informações:"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  return (result.response.text());
}

// run();

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
