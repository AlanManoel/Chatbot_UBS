const fs = require('fs');
const path = require('path');

const loadUsers = () => {
    const numbersFile = path.resolve(__dirname, "..", "numbers.json");

    if (!fs.existsSync(numbersFile)) return {};

    try {
        const data = fs.readFileSync(numbersFile, 'utf-8');
        const users = JSON.parse(data);
        return users;
    } catch (err) {
        console.log("Erro ao carregar os usuários:", err);
        return {};
    }
}

module.exports = { loadUsers };
