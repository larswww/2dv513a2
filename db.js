"use strict";

let sqlite = require("better-sqlite3");
let db = new sqlite("db/small-test-array.db");

let createDb = function(){

    db.on("open", () => {

        console.log("db open");
       // let userRelation = db.prepare("CREATE TABLE User (name TEXT PRIMARY KEY)");
      // let commentRelation = db.prepare("CREATE TABLE Comment (id TEXT PRIMARY KEY, parent_id TEXT, link_id TEXT, name TEXT, author TEXT, body TEXT, subreddit_id TEXT, subreddit TEXT, score INT, created_utc INT)");


        // userRelation.run();
       // commentRelation.run();
    });

   // db.run("CREATE TABLE User (name TEXT PRIMARY KEY)");
   // db.run("CREATE TABLE Comment (id TEXT PRIMARY KEY, body TEXT, score INT, created INT, author TEXT)");

    //db.run("DROP TABLE Comment");

};



let addRedditComment = function (arrayOfTuples) {

    // tuple[0] = id, [1] = parent_id, [2] = link_id, [3] = name, [4] = author, [5] = body, [6] = subreddit_id, [7] = subreddit
    // [8] = score, [9] = created_utc


        let commentStmt = db.prepare("INSERT INTO Comment(id, parent_id, link_id, name, author, body, subreddit_id, subreddit, score, created_utc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        arrayOfTuples.forEach(tuple => {
            commentStmt.run(tuple);
        });


        //commentStmt.run(arrayOfTuples);

        // let userStmt = db.prepare("INSERT INTO 'User'(name) VALUES($name)");
        //
        // userStmt.run({
        //     name: commentObject.name
        // })
};


module.exports = {
    create: createDb,
    addRedditComment: addRedditComment
};