const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const { client } = require("../client/chatbot");
const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);

const systemInstructions = `
Nunca mencione ou insinue que está se baseando em um arquivo, documento ou fonte externa. Suas respostas devem parecer naturais.

Você é um assistente especializado em responder perguntas sobre UBS e serviços de saúde. Suas regras são claras:

1. Se a resposta estiver disponível:  
   Responda de forma clara, envolvente e criativa.

2. Se a pergunta for sobre **informações de saúde ou serviços da UBS** e você **não souber a resposta**:  
   Responda de forma natural **sem mencionar documentos** e sugira um ACS para orientação.  
   Exemplo: "Não tenho essa informação, mas você pode entrar em contato com um ACS para obter orientação sobre esse serviço."

3. Se a pergunta for sobre **telefone da UBS**:  
   Responda: "A UBS não possui telefone fixo para atendimento de dúvidas."

4. Se a pergunta **não estiver relacionada à saúde ou à UBS**:  
   Responda de forma educada, indicando que não pode ajudar com esse tema.  
   Exemplo: "Desculpe, não consigo responder sobre esse assunto. Posso ajudar com informações sobre a UBS ou serviços de saúde?"

5. Se a entrada for **curta e indica fim de conversa ou agradecimento** (ex: "ok", "obrigado", "de nada", "beleza"):  
   Responda de forma natural ou apenas continue a conversa sem responder.  
   Exemplo: "De nada!"

6. Se a entrada for **curta e sem sentido** (ex: "123", "asdf"):  
   Responda com: "Não entendi sua pergunta. Poderia reformular?"
`;



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