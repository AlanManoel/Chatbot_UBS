const MESSAGE_REQUEST = "Digite o informativo que você deseja enviar para todos os números.";
const MESSAGE_CONFIRMATION = "O informativo foi enviado para todos os números salvos.";
const MESSAGE_GREETING = "Olá! Eu sou seu assistente virtual da UBS São Francisco.🤖";
const MESSAGE_INTRO = "Estou à disposição para esclarecer suas dúvidas e oferecer informações que você precisar sobre a nossa UBS-SF. 💬"
const MESSAGE_ASKNAME = "Informe seu nome e sobrenome? 🤔";
const EVALUATION_CONFIRMATION_MESSAGE = "Obrigado pela sua avaliação!\nEnvie mensagens para saber mais sobre a UBS ou tirar dúvidas.";
const EVALUATION_REQUEST_MESSAGE =
    "Gostaríamos de saber a sua opinião! Por favor, avalie-nos respondendo com um número de 1 a 5:\n" +
    "1 - Muito insatisfeito 😟\n" +
    "2 - Insatisfeito 😕\n" +
    "3 - Satisfeito 🙂\n" +
    "4 - Muito satisfeito 😄\n" +
    "5 - Excelente! 🌟";
const REQUEST_RATING_MESSAGE = "Por favor, forneça uma nota de 1 a 5:";
const MESSAGE_COMMAND =
    "✅ Para enviar um informativo a todos os usuários, digite: */enviarInformativo* e envie a mensagem desejada.\n" +
    "📄 Para cadastrar um novo documento, digite: */novoDocumento* e envie o novo arquivo para processamento.";
const MESSAGE_NEW_DOCUMENT = "📄 Envie o novo documento:";
const MESSAGE_DOCUMENT_SAVED = "✅ O novo arquivo foi salvo e enviado com sucesso!";
const MESSAGE_DOCUMENT_ERROR = "❌ Houve um erro ao processar o arquivo. Tente novamente.";
const LGPD_CONSENT_MESSAGE = `🔐 *Consentimento LGPD Necessário*\n
Antes de continuarmos, precisamos da sua autorização para coletar alguns dados, como o seu nome, conforme a Lei Geral de Proteção de Dados (LGPD).\n
Por favor, digite uma opção:\n
✅ *(1) SIM* para continuar e fornecer suas informações.\n
❌ *(0) NÃO* nesse caso, o uso do serviço não será possível.\n
🔒 Seus dados estão seguros com a gente.`;
const LGPD_REJECTION_MESSAGE = `❌ Você optou por *não fornecer* seus dados.\n
Infelizmente, sem o seu consentimento, não é possível utilizar este serviço conforme as exigências da Lei Geral de Proteção de Dados (LGPD).\n
Se mudar de ideia, é só voltar e digitar *(1)* para continuar.`;
const MESSAGE_INVALID_RESPONSE = "❗ *Resposta inválida.*\n\nPara continuar, você precisa digitar:\n✅ *1 ou SIM* para autorizar o uso dos seus dados conforme a LGPD.\n\nSem essa autorização, o uso do serviço não será possível.";

module.exports = {
    MESSAGE_REQUEST,
    MESSAGE_CONFIRMATION,
    MESSAGE_GREETING,
    MESSAGE_INTRO,
    MESSAGE_ASKNAME,
    EVALUATION_CONFIRMATION_MESSAGE,
    EVALUATION_REQUEST_MESSAGE,
    REQUEST_RATING_MESSAGE,
    MESSAGE_COMMAND,
    MESSAGE_NEW_DOCUMENT,
    MESSAGE_DOCUMENT_SAVED,
    MESSAGE_DOCUMENT_ERROR,
    LGPD_CONSENT_MESSAGE,
    MESSAGE_INVALID_RESPONSE,
    LGPD_REJECTION_MESSAGE
}