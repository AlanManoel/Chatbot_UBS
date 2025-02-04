require('dotenv').config();

const axios = require("axios");
const url = process.env.API_URL + "/users/";

const updateFeedback = async (user, feedback) => {
    try {
        const newData = {
            "nome": user.nome,
            "telefone": user.telefone,
            "avaliacao": feedback
        }
        const response = await axios.patch((url + user.id), newData);
        return response;
    } catch (e) {
        console.log(e);
        return;
    }
}

module.exports = { updateFeedback }
