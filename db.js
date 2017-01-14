"use strict";

let sqlite = require("sqlite3");
let db = new sqlite.Database("db/bigOne.db");

let createDb = function(){

    db.on("open", () => {

        console.log("db open");

        //With restrictions
        // let subredditRelation = db.prepare("CREATE TABLE Subreddit (subreddit_id VARCHAR PRIMARY KEY, subreddit TEXT UNIQUE)");
        // let postRelation = db.prepare("CREATE TABLE Post (id VARCHAR PRIMARY KEY, name TEXT, parent_id VARCHAR, link_id VARCHAR, author TEXT, body TEXT, subreddit_id VARCHAR, score INT, created_UTC INT)");


        // //No restrictions
        let subredditRelation = db.prepare("CREATE TABLE Subreddit (subreddit_id VARCHAR, subreddit TEXT)");
        let postRelation = db.prepare("CREATE TABLE Post (id VARCHAR PRIMARY KEY, name TEXT, parent_id VARCHAR, link_id VARCHAR, author TEXT, body TEXT, subreddit_id VARCHAR, score INT, created_UTC INT)");
        // // //
        subredditRelation.run();
        postRelation.run();
        // // Post:
        //     id (VARCHAR 7) - Unique, key,
        //     name (VARCHAR 10) - Unique, key
        // parent_id (VARCHAR 10)
        // link_id (VARCHAR 8)
        // author (TEXT 20)
        // body (TEXT 10000)
        // subreddit_id (VARCHAR 8)
        // score (INT)
        //
        //
        // created_utc (INT 10)
        //
        // SubReddit (subreddit_id -> subreddit):
        // subreddit_id (VARCHAR, 20)
        // subreddit (VARCHAR, 8)

    });

};



let addRedditComment = function (postTuples, subredditTuples) {

    // tuple[0] = id, [1] = parent_id, [2] = link_id, [3] = name, [4] = author, [5] = body, [6] = subreddit_id, [7] = subreddit
    // [8] = score, [9] = created_utc


        db.serialize(function () {

            db.run("BEGIN TRANSACTION");
            let postRelation = db.prepare("INSERT INTO Post(id, name, parent_id, link_id, author, body, subreddit_id, score, created_utc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            let subredditRelation = db.prepare("INSERT OR REPLACE INTO Subreddit(subreddit_id, subreddit) VALUES(?, ?)");


            postTuples.forEach(tuple => {
                postRelation.run(tuple);
            });

            subredditTuples.forEach(tuple => {
                subredditRelation.run(tuple);
            });

            db.run("COMMIT");

        });
};


module.exports = {
    create: createDb,
    addRedditComment: addRedditComment,
    db: db
};