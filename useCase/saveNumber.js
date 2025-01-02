const fs = require('fs');
const path = require('path');
const isNumberSaved = require("./isNumberSaved");

const saveNumber = (number) => {
    const numbersFile = path.resolve(__dirname, "..", "numbers.txt");

    if (isNumberSaved(number)) {
        console.log(`O número ${number} já está salvo.`);
        return;
    }

    fs.appendFile(numbersFile, number + "\n", (err) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(`O número: ${number} foi salvo.`)
        }
    });
}

module.exports = saveNumber;