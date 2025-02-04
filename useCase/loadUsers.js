require('dotenv').config();

const axios = require("axios");
const url = process.env.API_URL + "/users/";

const loadUsers = async () => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        console.log(e);
        return;
    }
}

module.exports = { loadUsers }
