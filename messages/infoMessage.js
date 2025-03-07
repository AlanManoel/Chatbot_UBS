const MESSAGE_REQUEST = "Digite o informativo que você deseja enviar para todos os números.";
const MESSAGE_CONFIRMATION = "O informativo foi enviado para todos os números salvos.";
const MESSAGE_GREETING = "Olá! Eu sou seu assistente virtual da UBS São Francisco.🤖";
const MESSAGE_ASKNAME = "Estou à disposição para esclarecer suas dúvidas e oferecer informações que você precisar sobre a nossa UBS-SF. 💬\n\n*Mas, primeiramente, poderia me informar seu nome e sobrenome?* 🤔";
const EVALUATION_CONFIRMATION_MESSAGE = "Obrigado pela sua avaliação!\nEnvie mensagens para saber mais sobre a UBS ou tirar dúvidas.";
const EVALUATION_REQUEST_MESSAGE =
    "Gostaríamos de saber a sua opinião! Por favor, avalie-nos respondendo com um número de 1 a 5:\n" +
    "1 - Muito insatisfeito 😟\n" +
    "2 - Insatisfeito 😕\n" +
    "3 - Satisfeito 🙂\n" +
    "4 - Muito satisfeito 😄\n" +
    "5 - Excelente! 🌟";
const REQUEST_RATING_MESSAGE = "Por favor, forneça uma nota de 1 a 5.";
const MESSAGE_COMMAND =
    "✅ Para enviar um informativo a todos os usuários, digite: */enviarInformativo* e envie a mensagem desejada.\n" +
    "📄 Para cadastrar um novo documento, digite: */novoDocumento* e envie o novo arquivo para processamento.";
const MESSAGE_NEW_DOCUMENT = "📄 Envie o novo documento:";
const MESSAGE_DOCUMENT_SAVED = "✅ O novo arquivo foi salvo e enviado com sucesso!";
const MESSAGE_DOCUMENT_ERROR = "❌ Houve um erro ao processar o arquivo. Tente novamente.";




module.exports = {
    MESSAGE_REQUEST,
    MESSAGE_CONFIRMATION,
    MESSAGE_GREETING,
    MESSAGE_ASKNAME,
    EVALUATION_CONFIRMATION_MESSAGE,
    EVALUATION_REQUEST_MESSAGE,
    REQUEST_RATING_MESSAGE,
    MESSAGE_COMMAND,
    MESSAGE_NEW_DOCUMENT,
    MESSAGE_DOCUMENT_SAVED,
    MESSAGE_DOCUMENT_ERROR
}