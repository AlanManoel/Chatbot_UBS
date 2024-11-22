const { GoogleGenerativeAI} = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);

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
            { text: "Responda apenas com base nas seguintes informações:" },
          ],
        },
      ],
    });
    const result = await chatSession.sendMessage(prompt);
    return (result.response.text());
  }

module.exports = {run}