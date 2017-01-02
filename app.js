"use strict";

let fs = require("fs");
let db = require("./db.js");

let stream = fs.createReadStream("resources/RC_2011-07");
let remainder = "";
let time;

stream.setEncoding("utf8");


db.create();
console.time("worktuples");

let dataObjectToArrayOfArrays = function(objectArray) {
    let arrayOfTuples = [];

    objectArray.forEach(commentObject => {
        let tuple = [];

        //TODO ugly but really how else to get them in definite order?
        try {

            tuple[0] = commentObject["id"];
            tuple[1] = commentObject["parent_id"];
            tuple[2] = commentObject["link_id"];
            tuple[3] = commentObject["name"];
            tuple[4] = commentObject["author"];
            tuple[5] = commentObject["body"];
            tuple[6] = commentObject["subreddit_id"];
            tuple[7] = commentObject["subreddit"];
            tuple[8] = commentObject["score"];
            tuple[9] = commentObject["created_utc"];

            if (tuple.length != 10) {
                throw new RangeException("tuple should have 10 attributes");
            }

        } catch (e) {
            console.error(e);
        }

        arrayOfTuples.push(tuple);
    });

   db.addRedditComment(arrayOfTuples);

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