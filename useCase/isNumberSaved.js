const fs = require('fs');
const path = require('path');

const isNumberSaved = (number) => {
    const numbersFile = path.resolve(__dirname, "..", "numbers.txt");

    try {
        const data = fs.readFileSync(numbersFile, "utf-8");  

        if (data && data.includes(number)) {
            return true;  
        } else {
            return false;  o
        }
    } catch (err) {
        if (err.code !== 'ENOENT') {
            console.error("Erro ao ler o arquivo:", err);
        }
        return false;  
    }
}

module.exports = isNumberSaved;
