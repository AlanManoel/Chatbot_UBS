const fs = require('fs');
const path = require('path');

const saveNumber = (number) => {
    const numbersFile = path.resolve(__dirname, "..", "numbers.txt");

    fs.readFile(numbersFile, "utf-8", (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error("Error reading file:", err);
            return;
        }

        if (!data || !data.includes(number)) {
            fs.appendFile(numbersFile, number + "\n", (err) => {
                if (err) {
                    return console.log(err);
                } else {
                    console.log(`O número: ${number} foi salvo.`)
                }
            });
        } else {
            console.log(`O número ${number}  já está salvo.`);
        }
    });
}

module.exports = saveNumber;