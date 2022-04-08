const MongoClient = require('mongodb').MongoClient;
//const url = "mongodb://localhost:27017/";
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config()
const session = require('express-session');
app.use(express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
var db;
//module.exports = app;


MongoClient.connect(process.env.url, function (err, client) {
  if (err) throw err;
  db = client.db('UglyAnimals');
  app.listen(8080);
  console.log("Running on 8080")
});

//Redirect to correct index page
app.get('/', function (req, res) {
  res.render('pages/index.ejs');
});

app.post('/', function (req, res) {
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

app.get('/account', function (req, res) {
  res.render('pages/account.ejs');
});

app.get('/editAccount', function (req, res) {
  datasend = {
    name : session.username
  }
  console.log(datasend )
  res.render('pages/editAccount.ejs',datasend);
});



app.post('/signOut', function (req, res) {
  res.send(signOut());
})

//Get all the stats from the AnimalStats and send to client
app.get("/getAnimalStats", function (req, res) {
  db.collection('AnimalStats').find(req.body).toArray(function (err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
});

//Get all the stats from the AnimalStats and send to client
app.get("/getEvents", function (req, res) {
  db.collection('EventInfo').find(req.body).toArray(function (err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));

  });
});

app.post("/incrementEvent", function (req, res) {

  var query = { EventID: req.body.EventID };
  console.log(query)
  console.log(parseInt(req.body.number))
  db.collection('EventInfo').updateOne(query, { $inc: { TotalInterested: parseInt(req.body.number) } }, function (err, result) {
    if (err) throw err;
    res.send("Success");
  });

});

app.post("/updateInterestedEvents", function (req, res) {
  var query = { Username: req.body.Username };
  var newvalues = {
    $set: {
      EventsInterested: req.body.EventsInterested
    }
  }

  session.eventsInterested = req.body.EventsInterested;
  db.collection('login').updateOne(query, newvalues, function (err, result) {
    if (err) throw err;
    res.send("Success");
  });

});

app.post("/updateUserName", function (req, res) {
  session.username = req.body.NewUsername;
  db.collection('login').updateOne({ Username: req.body.Username }, {$set: {Username: req.body.NewUsername} }, function (err, result) {
    if (err) throw err;
    res.send(":)");
  });

});

app.post("/updateUserPassword", function (req, res) {

  let username = req.body.Username
  let password = req.body.Password
  let newPassword = req.body.NewPassword

  db.collection('login').find({ "Username": session.username }).toArray(function (err, result) {

    if (result[0]["Password"] == password) {

      db.collection('login').updateOne({ Username: username }, {$set: {Password: newPassword} }, function (err, result) {
        if (err) throw err;
        res.send("Success");
      });

    }else{
      res.send("Incorrect Password");
    }


  });


});

app.post("/deleteUser", function (req, res){

  var user = { Username: req.body.Username, Password : req.body.Password };
  console.log(user)
  db.collection("login").deleteOne(user, function(err, obj) {
    if (err) throw err;
    console.log("Bye")
    res.send(signOut())
  });
})

//Redirect to correct events page
app.post('/getLoginInfo', function (req, res) {
  res.send(getLoginInfo());
});

//Format Login Info
function getLoginInfo() {
  sessionInfo = {
    Username: session.username,
    Admin: session.admin,
    EventsInterested: session.eventsInterested
  }
  console.log(sessionInfo)
  return JSON.stringify(sessionInfo);
}

//This is the method that checks whether the users information is correct
app.post('/loginAuth', function (request, response) {
  // Capture the input fields
  let username = request.body.Username
  let password = request.body.Password
  // Ensure the input fields exists and are not empty
  console.log(username + "-" + password)
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
          session.eventsInterested = result[0]["EventsInterested"]

          console.log("Signed In")
          // Redirect to home page
          response.send(":)");
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

function signOut(){
  session.loggedin = false;
  session.username = null;
  session.admin = null
  session.eventsInterested = null
  console.log("Signed Out")
  return "Done :)"
}
