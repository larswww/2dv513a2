"use strict";

let sqlite = require("sqlite3");
let db = new sqlite.Database("db/medium.db");

let createDb = function(){

    db.on("open", () => {

        console.log("db open")
    });

    db.run("CREATE TABLE User (name TEXT PRIMARY KEY)");
   db.run("CREATE TABLE Comment (id TEXT PRIMARY KEY, body TEXT, score INT, created INT, author TEXT)");

    //db.run("DROP TABLE Comment");

};



let addRedditComment = function (commentObject) {
    db.serialize(function () {

        let commentStmt = db.prepare("INSERT INTO Comment(id, body, score, created, author) VALUES($id, $body, $score, $created, $author)");

        commentStmt.run({
            $id: commentObject.id,
            $body: commentObject.body,
            $score: commentObject.score,
            $created: commentObject.created_utc,
            $author: commentObject.author

        });

        let userStmt = db.prepare("INSERT INTO 'User'(name) VALUES($name)");

        userStmt.run({
            $name: commentObject.name
        })
    })
};


module.exports = {
    create: createDb,
    addRedditComment: addRedditComment
};