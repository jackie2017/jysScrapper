var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Initialize Express
var app = express();
/// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;
// Instantiate our Express App
var app = express();
// Set up an Express Router
var router = express.Router();
// Require our routes file pass our router object
require("./config/routes")(router);
// Designate our public folder as a static directory
app.use(express.static(__dirname + "/public"));
// Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
// Use bodyParser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));
// Have every request go through our router middleware
app.use(router);
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Connect mongoose to our database
mongoose.connect(db, function(error) {
    // Log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    // Or log a success message
    else {
        console.log("mongoose connection is successful");
    }
});
// Listen on the port
app.listen(PORT, function() {
            console.log("Listening on port:" + PORT);
            //});se morgan and body parser with our app
            ended: false
                //}));
                // Make public a static dir
            app.use(express.static("public"));
            // Database configuration with mongoose
            var databaseUri = 'mongodb://localhost/jyscrapper';
            if (process.env.MONGODB_URI) {
                mongoose.connect(process.env.MONGODB_URI);
            } else {
                mongoose.connect(databaseUri);
            }
            //mongodb://heroku_2z2lw0pg:5195ukucf5hfa5ihrqelp3n77v@ds163681.mlab.com:63681/heroku_2z2lw0pg
            var db = mongoose.connection;
            // Show any mongoose errors
            db.on("error", function(error) {
                console.log("Mongoose Error: ", error);
            });
            // Once logged in to the db through mongoose, log a success message
            db.once("open", function() {
                console.log("Mongoose connection successful.");
            });
            // Routes
            // ======
            // A GET request to scrape the usatoday website
            app.get("/scrape", function(req, res) {
                // First, we grab the body of the html with request
                request("https://www.usatoday.com/", function(error, response, html) {
                    // Then, we load that into cheerio and save it to $ for a shorthand selector
                    var $ = cheerio.load(html);
                    // Now, we grab every h2 within an article tag, and do the following:
                    $("article h2").each(function(i, element) {
                        // Save an empty result object
                        var result = {};
                        // Add the text and href of every link, and save them as properties of the result object
                        result.title = $(this).children("a").text();
                        result.link = $(this).children("a").attr("href");
                        // Using our Article model, create a new entry
                        // This effectively passes the result object to the entry (and the title and link)
                        var entry = new Article(result);
                        // Now, save that entry to the db
                        entry.save(function(err, doc) {
                            // Log any errors
                            if (err) {
                                console.log(err);
                            }
                            // Or log the doc
                            else {
                                console.log(doc);
                            }
                        });
                    });
                });
                // Tell the browser that we finished scraping the text
                res.send("Scrape Complete");
            });
            // This will get the articles we scraped from the mongoDB
            app.get("/articles", function(req, res) {
                // Grab every doc in the Articles array
                Article.find({}, function(error, doc) {
                    // Log any errors
                    if (error) {
                        console.log(error);
                    }
                    // Or send the doc to the browser as a json object
                    else {
                        res.json(doc);
                    }
                });
            });
            // Grab an article by it's ObjectId
            app.get("/articles/:id", function(req, res) {
                // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
                Article.findOne({ "_id": req.params.id })
                    // ..and populate all of the notes associated with it
                    .populate("note")
                    // now, execute our query
                    .exec(function(error, doc) {
                        // Log any errors
                        if (error) {
                            console.log(error);
                        }
                        // Otherwise, send the doc to the browser as a json object
                        else {
                            res.json(doc);
                        }
                    });
            });
            // Create a new note or replace an existing note
            app.post("/articles/:id", function(req, res) {
                // Create a new note and pass the req.body to the entry
                var newNote = new Note(req.body);
                // And save the new note the db
                newNote.save(function(error, doc) {
                    // Log any errors
                    if (error) {
                        console.log(error);
                    }
                    // Otherwise
                    else {
                        // Use the article id to find and update it's note
                        Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                            // Execute the above query
                            .exec(function(err, doc) {
                                // Log any errors
                                if (err) {
                                    console.log(err);
                                } else {
                                    // Or send the document to the browser
                                    res.send(doc);
                                }
                            });
                    }
                });
            });
            var port = process.env.PORT || 3000;
            // Listen on port 3000
            app.listen(port, function() {
                        console.log("App running on port 3000!");
            });
            
