"use strict";

let fs = require("fs");
let db = require("./db.js");

let stream = fs.createReadStream("resources/RC_2007-10");
let remainder = "";

stream.setEncoding("utf8");


db.create();
console.time("worktuples");

let dataObjectToArrayOfArrays = function(objectArray) {
    let arrayOfSubreddits = [];
    let arrayOfPosts =[];

    objectArray.forEach(commentObject => {
        let postTuple = [];
        let subredditTuple = [];

        //TODO ugly but really how else to get them in definite order?
        try {
            //"INSERT INTO Post(id, name, parent_id, link_id, author, body, subreddit_id, score, created_utc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            //"INSERT INTO Subreddit(subreddit_id, subreddit) VALUES(?, ?)";

            subredditTuple[0] = commentObject["subreddit_id"];
            subredditTuple[1] = commentObject["subreddit"];

            postTuple[0] = commentObject["id"];
            postTuple[1] = commentObject["name"];
            postTuple[2] = commentObject["parent_id"];
            postTuple[3] = commentObject["link_id"];
            postTuple[4] = commentObject["author"];
            postTuple[5] = commentObject["body"];
            postTuple[6] = commentObject["subreddit_id"];
            postTuple[7] = commentObject["score"];
            postTuple[8] = commentObject["created_utc"];

            // if (subredditTuple.length != 2) {
            //     throw new RangeException("tuple should have 2 attributes");
            // } else if (postTuple.length != 8) {
            //     throw RangeException("post should have 8 attributes");
            // }

        } catch (e) {
            console.error(e);
        }

        arrayOfPosts.push(postTuple);
        arrayOfSubreddits.push(subredditTuple);
    });

   db.addRedditComment(arrayOfPosts, arrayOfSubreddits);

};

let dataStreamToObjects = function(data) {

    let posts = data.split(/\r?\n/);
    let parsedPosts = [];
    posts[0] = remainder + posts[0];

    posts.forEach(post => {

        try {

            let parsed = JSON.parse(post);
            parsedPosts.push(parsed);

        } catch (e) {

            if (e.name === "SyntaxError") {
                return remainder = posts.pop();
            }

            console.error(e);
            throw e;
        }

    });

    dataObjectToArrayOfArrays(parsedPosts);

};

// stream.pipe(dataHandler);

stream.on("data", (data) => {
    stream.pause();

    dataStreamToObjects(data);

stream.resume();

});

stream.on("end", ()=> {
console.timeEnd("worktuples");
});