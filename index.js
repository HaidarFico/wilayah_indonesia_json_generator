const csv = require("csv-parser");
const fs = require("fs");
const uuid = require("uuid");

const province = [];
const city = [];
const regency = [];

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

function kabupatenTranslate(str) {
  return str.replace(
    /Kab\./,
    () => {
      return 'Kabupaten'
    }
  );
}

fs.createReadStream("./Wilayah_Indonesia.csv")
  .pipe(csv())
  .on("data", (data) => {
    const codeLength = data["Kode_Area"].split(".").length;
    if (codeLength === 1) {
      data.uuid = uuid.v4();
      data.Nama = toTitleCase(data.Nama);
      province.push(data);
    } else if (codeLength === 2) {
      data.uuid = uuid.v4();
      data.Nama = toTitleCase(data.Nama);
      city.push(data);
    } else if (codeLength === 3) {
      data.uuid = uuid.v4();
      data.Nama = toTitleCase(data.Nama);
      regency.push(data);
    }
  })
  .on("end", () => {
    for (const cityDataEntry of city) {        
      const provinceCode = cityDataEntry['Kode_Area'].split('.')[0];
      const provinceObject = province.find((obj) => {
        return obj.Kode_Area === provinceCode;
      });
      cityDataEntry.province_uuid = provinceObject.uuid
      if (cityDataEntry.Nama.includes('Kab.')) {
        cityDataEntry.Nama = kabupatenTranslate(cityDataEntry.Nama)
      }
    }

    for (const regencyDataEntry of regency) {        
      const cityCodeArray = regencyDataEntry['Kode_Area'].split('.');
      const cityCode = `${cityCodeArray[0]}.${cityCodeArray[1]}`
      const cityObject = city.find((obj) => {
        return obj.Kode_Area === cityCode;
      });
      regencyDataEntry.city_uuid = cityObject.uuid
    }
    fs.writeFileSync("result/province.json", JSON.stringify(province));
    fs.writeFileSync("result/city.json", JSON.stringify(city));
    fs.writeFileSync("result/regency.json", JSON.stringify(regency));
  });
