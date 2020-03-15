const csv = require("jquery-csv");
const fs = require("fs");

function accumulate_by_country(csv_filename) {
  const csv_data = fs.readFileSync(csv_filename, "utf8").toString();
  // console.log(csv_data)
  const result = csv.toObjects(csv_data);

  const new_data = {};
  for (const idx in result) {
    const obj = result[idx];
    const country = obj["Country/Region"];
    for (const key in obj) {
      if (!["Country/Region", "Province/State", "Lat", "Long"].includes(key)) {
        const new_key = country + "@" + key;
        // console.log(`${key}: ${obj[key]}`)
        // console.log(`${new_key} - ${key}: ${obj[key]}`)
        if (new_key in new_data) {
          new_data[new_key] += parseInt(obj[key], 10);
        } else {
          new_data[new_key] = parseInt(obj[key], 10);
        }
      }
    }
  }

  return new_data;
}

function generate_data(new_data) {
  const final_data = [];
  for (const key in new_data) {
    // console.log(`${key}: ${new_data[key]}`)
    const value = new_data[key];
    const keys = key.split("@");
    const tokens = keys[1].split("/");
    var date;
    if (tokens[0].length === 1 && tokens[1].length === 1) {
      date =
        "20" +
        tokens[2] +
        "-0" +
        tokens[0] +
        "-0" +
        tokens[1] +
        "T00:00:00.000Z";
    } else if (tokens[0].length === 1 && tokens[1].length > 1) {
      date =
        "20" +
        tokens[2] +
        "-0" +
        tokens[0] +
        "-" +
        tokens[1] +
        "T00:00:00.000Z";
    } else if (tokens[0].length > 1 && tokens[1].length === 1) {
      date =
        "20" +
        tokens[2] +
        "-" +
        tokens[0] +
        "-0" +
        tokens[1] +
        "T00:00:00.000Z";
    } else {
      date =
        "20" + tokens[2] + "-" + tokens[0] + "-" + tokens[1] + "T00:00:00.000Z";
    }
    const item = { name: keys[0], date: date, value: value, category: "test" };
    final_data.push(item);
  }
  return final_data;
}

const csv_filename = "corona_confirmed.csv";
const new_data = accumulate_by_country(csv_filename);
const final_data = generate_data(new_data);
var jsonData = JSON.stringify(final_data);
// console.log(final_data);
fs.writeFile("../src/covid_data.json", jsonData, function(err) {
  if (err) {
    console.log(err);
  }
});
