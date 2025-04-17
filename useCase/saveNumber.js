require('dotenv').config();

const axios = require("axios");
const url = process.env.API_URL + "/users/";

const saveNumber = async (nome = '', telefone = '') => {
    const userData = {
        nome, telefone
    };

    try {
        await axios.post(url, userData);
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
        throw new Error("Erro ao salvar no banco de dados");
    }
}

module.exports = { saveNumber };