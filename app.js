"use strict";

let fs = require("fs");
let db = require("./db.js");

let stream = fs.createReadStream("resources/RC_2012-12");
let remainder = "";

stream.setEncoding("utf8");


db.create();

stream.on("data", (data) => {
    stream.pause();

    let posts = data.split(/\r?\n/);
    posts[0] = remainder + posts[0];

    posts.forEach(post => {

        try {
            db.addRedditComment(JSON.parse(post));

        } catch (e) {

            if (e.name === "SyntaxError") {
                return remainder = posts.pop();
            }

            console.error(e);
            throw e;
        }

    });

stream.resume();

});