const { GoogleGenerativeAI} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_GEMINI);

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
/*     if (!uploadedFile) {
      throw new Error("Arquivo PDF não foi carregado!");
    } */
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