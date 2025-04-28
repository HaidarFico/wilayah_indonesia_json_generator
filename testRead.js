const fs = require("fs");

const buffer = JSON.parse(fs.readFileSync('./city.json'));

console.log(buffer[6].Nama);