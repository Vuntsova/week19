var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require Article Schema
var Article = require("./models/article");

// Create Instance of Express
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

mongoose.connect("mongodb://localhost/react-scrubber");
var db = mongoose.connection;

db.on("error", function(err) {
    console.log("Mongoose Error: ", err);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/api", function(req, res) {

    // We will find all the records, sort it in descending order, then limit the records to 5
    Article.find({}).sort([
        ["date", "descending"]
    ]).limit(5).exec(function(err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(doc);
        }
    });
});


app.post("/api", function(req, res) {
    console.log("BODY: " + req.body.title);


    Article.create({
        title: req.body.title,
        date: Date.now(),
        url: req.body.url
    }, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("Saved Search");
        }
    });
});

// -------------------------------------------------

// Listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});