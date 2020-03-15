// const csvToJson = require("convert-csv-to-json");
// const fileInputName = "./corona_confirmed.csv";
// const fileOutputName = "./data.json";

// csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);

const csvFilePath='corona_confirmed.csv'
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    console.log(jsonObj);
    /**
     * [
     * 	{a:"1", b:"2", c:"3"},
     * 	{a:"4", b:"5". c:"6"}
     * ]
     */ 
})
 
// Async / await usage
const jsonArray=await csv().fromFile(csvFilePath);