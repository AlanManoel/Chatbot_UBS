require('dotenv').config();

const axios = require("axios");
const url = process.env.API_URL + "/log/";

const createLog = async (userId, message) => {
    const logData = {
        userId, message
    };

    try {
        await axios.post(url, logData);
    } catch (error) {
        console.error("Erro ao criar o log:", error);
    }
}

module.exports = { createLog };