/**
 * Created by mbp on 12/01/2017.
 */
"use strict";

let fs = require("fs");

let stream = fs.createReadStream("resources/RC_2012-12");
let remainder = "";

let max = {
    "id": 0,
    "parent_id": 0,
    "link_id": 0,
    "name": 0,
    "author": 0,
    "body": 0,
    "subreddit": 0,
    "subreddit_id": 0,
    "score": 0,
    "created_utc": 0,
}

stream.setEncoding("utf8");

let dataStreamToObjects = function(data) {

    let posts = data.split(/\r?\n/);
    posts[0] = remainder + posts[0];

    posts.forEach(post => {

        try {

            let parsed = JSON.parse(post);
            for (var key in parsed) {
                if(parsed.hasOwnProperty(key)) {
                    if (typeof parsed[key] === "string") {
                        if (max[key] < parsed[key].length) {
                            max[key] = parsed[key].length;
                        }
                    } else if (typeof parsed[key] === "number") {
                        if (max[key] < parsed[key]) {
                            max[key] = parsed[key];
                        }
                    } else {
                        //console.log(key);
                    }
                }
            }


        } catch (e) {

            if (e.name === "SyntaxError") {
                return remainder = posts.pop();
            }

            console.error(e);
            throw e;
        }

    });
};

// stream.pipe(dataHandler);

stream.on("data", (data) => {
    stream.pause();

    dataStreamToObjects(data);

    stream.resume();

});

stream.on("end", function() {
    console.log(max);
});