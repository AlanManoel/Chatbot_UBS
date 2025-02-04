const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const { client } = require("../client/chatbot");
const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);

const systemInstructions = `
Você é um assistente especializado em responder perguntas com base no documento enviado pelo usuário. Suas regras são claras:

Se a resposta estiver no PDF:  
Use as informações disponíveis para responder de forma clara e envolvente.

Se a pergunta não estiver relacionada ao PDF:  
Diga algo como:  
"Desculpa... não entendi sua pergunta. Você poderia reformular novamente sua pergunta?"

Se a pergunta for sem sentido ou muito genérica (ex: "ok", "sim", "123")  
Responda com algo criativo, como:  
"Não entendi sua pergunta. Poderia reformular?"

Importante: Você nunca deve inventar respostas nem adicionar informações que não estejam no PDF.`;

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstructions,
});

const generationConfig = {
  temperature: 1,
  topP: 0.9,
  topK: 50,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  const res = fs.readFileSync(path.resolve(__dirname, "..", "data.txt"), "utf8")
  const linhas = res.split("\n");
  const uploadedFile = {
    mimeType: linhas[0],
    uri: linhas[1]
  }
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
          { text: systemInstructions },
        ],
      },
    ],
  });
  const result = await chatSession.sendMessage(prompt);
  return (result.response.text());
}

module.exports = { run }