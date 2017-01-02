"use strict";

let sqlite = require("sqlite3");
let db = new sqlite.Database("db/sq3-med-test-array.db");

let createDb = function(){

    db.on("open", () => {

        console.log("db open");

        let commentRelation = db.prepare("CREATE TABLE Comment (id TEXT PRIMARY KEY, parent_id TEXT, link_id TEXT, name TEXT, author TEXT, body TEXT, subreddit_id TEXT, subreddit TEXT, score INT, created_utc INT)");

        commentRelation.run();
    });
};



let addRedditComment = function (arrayOfTuples) {

    // tuple[0] = id, [1] = parent_id, [2] = link_id, [3] = name, [4] = author, [5] = body, [6] = subreddit_id, [7] = subreddit
    // [8] = score, [9] = created_utc


        db.serialize(function () {

            db.run("BEGIN TRANSACTION");
            let commentStmt = db.prepare("INSERT INTO Comment(id, parent_id, link_id, name, author, body, subreddit_id, subreddit, score, created_utc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");


            arrayOfTuples.forEach(tuple => {
                commentStmt.run(tuple);
            });

            db.run("COMMIT")

        });
};


module.exports = {
    create: createDb,
    addRedditComment: addRedditComment
};