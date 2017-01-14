let sqlite = require("sqlite3");
let db = new sqlite.Database("db/sq3-med-test-array.db");

let createDb = function(){

    db.on("open", () => {

        console.log("db open");

        let classesRelation = db.prepare("CREATE TABLE Classes (class TEXT, type TEXT, country TEXT, numGuns INT, bore TEXT, displacement TEXT");
        let shipsRelation = db.prepare("CREATE TABLE Ships (name TEXT, class TEXT, launched INT");
        let battlesRelation = db.prepare("CREATE TABLE Battles (name TEXT, date TEXT)");
        let outcomesRelation = db.prepare("CREATE TABLE Outcomes (name TEXT, battle TEXT, result INT)");



    });
};

