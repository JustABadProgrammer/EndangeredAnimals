const MongoClient = require('mongodb').MongoClient;
//const url = "mongodb://localhost:27017/";
const url = "mongodb+srv://JustABadProgrammer:HelloBees12@cluster0.dsxnt.mongodb.net/test";
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const session = require('express-session');
app.use(express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
var db;
//module.exports = app;


MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  db = client.db('UglyAnimals');
  app.listen(8080);
  console.log("Running on 8080")
});

//Redirect to correct index page
app.get('/', function (req, res) {
  res.render('pages/index.ejs');
});

//Redirect to correct game page
app.get('/game', function (req, res) {
  res.render('pages/game.ejs');
});

//Redirect to correct events page
app.get('/events', function (req, res) {
  res.render('pages/events.ejs');
});

//Get all the stats from the AnimalStats and send to client
app.get("/getAnimalStats", function (req, res) {
  db.collection('AnimalStats').find(req.body).toArray(function (err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

//Format Login Info
function getLoginInfo() {
  sessionInfo = {
    Username: session.username,
    Admin: session.admin
  }
  return JSON.stringify(sessionInfo);
}

//This is the method that checks whether the users information is correct
app.post('/loginAuth', function (request, response) {
  // Capture the input fields
  let username = request.body.Username
  let password = request.body.Password
  // Ensure the input fields exists and are not empty
  console.log(username + "-"+password)
  if (username && password) {
    console.log(username + "-" + password)
    //Query the database for a person with the same username
    db.collection('login').find({ "Username": username }).toArray(function (err, result) {
      //db.collection.find({ "serialnumber" : { $exists : true, $ne : null } })
      // If there is an issue with the query, output the error
      if (err) throw err;
      //Check if if the account exists
      if (result.length == 1) {
        //Check if its the correct password
        console.log(result)
        if (result[0]["Password"] == password) {
          // Authenticate the user
          session.loggedin = true;
          session.username = username;
          session.admin = result[0]["Admin"]
          // Redirect to home page
          response.send(getLoginInfo());
          //console.log("LoggedIn")
        } else {
          response.send('');
        }
      } else {
        response.send('');
      }
      response.end();
    });
  } else {
    response.send('');
    response.end();
  }
});
