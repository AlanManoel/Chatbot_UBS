const { GoogleAIFileManager } = require("@google/generative-ai/server");
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

  module.exports = {waitForFilesActive, uploadToGemini}