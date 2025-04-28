const csv = require("csv-parser");
const fs = require("fs");
const uuid = require('uuid');

const province = [];
const city = []
const regency = []

fs.createReadStream("./Wilayah_Indonesia.csv")
  .pipe(csv())
  .on("data", (data) => {
    const codeLength = data['Kode_Area'].split('.').length;

    if (codeLength === 1) {
        data.uuid = uuid.v4();
        province.push(data);
      }
      else if (codeLength === 2) {
        data.uuid = uuid.v4();
        city.push(data);
      }
      else if (codeLength === 3) {
        data.uuid = uuid.v4();
        regency.push(data);
    }
  })
  .on("end", () => {
        fs.writeFileSync('result/province.json', JSON.stringify(province));
        fs.writeFileSync('result/city.json', JSON.stringify(city));
        fs.writeFileSync('result/regency.json', JSON.stringify(regency));
  });
