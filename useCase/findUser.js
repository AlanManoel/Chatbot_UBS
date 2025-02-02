require('dotenv').config();

const axios = require("axios");
const url = process.env.API_URL + "/users/by-phone/";

const findUser = async (number) => {
    try {
        const response = await axios.get(url + number);
        return response.data;
    } catch (e) {
        console.log(e);
        return;
    }
}

module.exports = { findUser }
