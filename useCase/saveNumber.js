const fs = require('fs');
const path = require('path');


const saveNumber = (number, name) => {
    const numbersFile = path.resolve(__dirname, "..", "numbers.json");


    let users = {};
    if (fs.existsSync(numbersFile)) {
        const data = fs.readFileSync(numbersFile, "utf-8");
        users = JSON.parse(data);
    }

    if (users[number]) {
        console.log(`O número ${number} já está salvo.`);
        return;
    }

    users[number] = name;

    fs.writeFileSync(numbersFile, JSON.stringify(users, null, 2));
    console.log(`O número: ${number} foi salvo.`);
}

module.exports = { saveNumber };
