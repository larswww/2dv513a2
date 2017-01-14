let sqlite = require("sqlite3");
let db = new sqlite.Database("db/medium3.db");

let sqlArray = [
	"SELECT count(*) FROM Post WHERE author = '[deleted]'",
	"SELECT count(*) FROM Post WHERE subreddit_id = (SELECT subreddit_id FROM Subreddit WHERE subreddit = 'reddit.com')",
	"SELECT count(*) FROM Post WHERE body LIKE '%lol%'",
	"SELECT DISTINCT subreddit FROM Subreddit WHERE subreddit_id IN (SELECT DISTINCT subreddit_id FROM Post WHERE author IN (SELECT DISTINCT author FROM Post WHERE link_id = 't3_11qhc'))",
	"SELECT author, MAX(score) FROM  (SELECT author, SUM(score) AS score FROM Post WHERE author != '[deleted]' GROUP BY author)",
	"SELECT author, MIN(score) FROM  (SELECT author, SUM(score) AS score FROM Post WHERE author != '[deleted]' GROUP BY author)",
	"SELECT DISTINCT subreddit FROM Subreddit NATURAL JOIN (SELECT subreddit_id, MIN(score) FROM Post)",
	"SELECT DISTINCT subreddit FROM Subreddit NATURAL JOIN (SELECT subreddit_id, MAX(score) FROM Post)",
	"SELECT DISTINCT author FROM Post WHERE author != 'gigaquack' AND link_id IN (SELECT link_id FROM Post WHERE author = 'gigaquack')",
	"SELECT author, count FROM (SELECT author, count(author) AS count FROM (SELECT author, subreddit_id FROM Post GROUP BY author, subreddit_id) GROUP BY author) WHERE count = 1",
];

function runSQL(query, callback) {
	db.serialize(function () {
		console.time(query);
        db.each(query, function(err, row) {
        	if (err) return console.log(err);
        	//console.log(row);
        }, function(err, result) {
        	if (err) return console.log(err);
        	console.timeEnd(query);
        	callback();
        });
    });
}

var runner = function() {
	if(sqlArray.length !== 0) {
		runSQL(sqlArray.shift(), runner);
	}
}

db.on("open", () => {
	console.log("db open");
	runner();
});