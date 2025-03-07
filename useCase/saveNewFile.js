const fs = require('fs');
const path = require('path');
const { uploadToGemini, waitForFilesActive } = require('./sendFile');

async function saveNewFile(media) {
  try {
    const docsFolderPath = path.resolve(__dirname, "..", "docs");
    const filePath = path.join(docsFolderPath, "DadosSF.pdf");
    const dataFilePath = path.resolve(__dirname, "..", "data.txt"); 

    if (!fs.existsSync(docsFolderPath)) {
      fs.mkdirSync(docsFolderPath, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Arquivo antigo removido: ${filePath}`);
    }

    fs.writeFileSync(filePath, media.data, 'base64');
    console.log(`Novo arquivo salvo em: ${filePath}`);

    console.log("Enviando o novo arquivo para o Gemini...");
    const uploadedFile = await uploadToGemini(filePath, media.mimetype);
    await waitForFilesActive([uploadedFile]);

    console.log("Arquivo enviado com sucesso!");

    if (fs.existsSync(dataFilePath)) {
      fs.truncateSync(dataFilePath, 0); 
      console.log("Conteúdo do arquivo data.txt removido com sucesso.");
    }

    fs.writeFileSync(dataFilePath, `${uploadedFile.mimeType}\n${uploadedFile.uri}`);
    console.log("O novo conteúdo foi salvo no arquivo data.txt com sucesso!");

    return filePath;
  } catch (error) {
    console.error("Erro ao salvar o arquivo:", error);
    throw error;
  }
}

module.exports = { saveNewFile };
