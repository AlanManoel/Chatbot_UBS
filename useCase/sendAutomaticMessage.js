const { loadUsers } = require("../useCase/loadUsers");

const sendAutomaticMessage = async (client, message) => {
  try {
    const users = await loadUsers();

    for (const user of users) {
      try {
        await client.sendMessage(user.telefone, message);
        console.log(`Mensagem enviada para: ${user.telefone}`);
      } catch (error) {
        console.error(`Erro ao enviar para ${user.telefone}:`, error);
      }
    }
  } catch (e) {
    return;
  }
}

module.exports = { sendAutomaticMessage }
