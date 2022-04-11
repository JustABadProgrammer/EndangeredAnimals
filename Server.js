const MongoClient = require('mongodb').MongoClient;
//const url = "mongodb://localhost:27017/";
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config()
const session = require('express-session');
const crypto = require ("crypto");

app.use(express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.use(session({
	secret: 'replace me',
	resave: true,
	saveUninitialized: true
}));


var db;
const multer = require('multer');

//const upload = multer({dest:'assets/images/Posts'});
//module.exports = app;
var path = require('path');
const { title } = require('process');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/images/Posts/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }

})

const upload = multer({ storage: storage });

MongoClient.connect(process.env.url, function (err, client) {
  if (err) throw err;
  db = client.db('UglyAnimals');
  app.listen(8080);
  console.log("Running on 8080")
});

//Redirect to correct index page
app.get('/', function (req, res) {
  db.collection('MainPagePosts').find(req.body).toArray(function (err, result) {
    if (err) throw err;
    //res.send(JSON.stringify(result));
    res.render('pages/index.ejs', { content: result, admin: req.session.admin, session : JSON.stringify(req.session)});
  });
});

//Redirect to correct game page
app.get('/game', function (req, res) {
  db.collection('Leaderboard').find().toArray(function (err, result) {
    if (err) throw err;
    // res.render('pages/game.ejs', {User : result["Leaderboard"][0], Score : result["Leaderboard"][1]});

    resultJSON = JSON.parse(JSON.stringify(result))[0].Leaderboard

    users = resultJSON[0];
    score = resultJSON[1];

    res.render('pages/game.ejs', { User: users, Score: score, PB: req.session.personalBest, session : JSON.stringify(req.session)});

  });
});

//Redirect to correct events page
app.get('/events', function (req, res) {
  res.render('pages/events.ejs', {session : JSON.stringify(req.session)});
});

app.get('/account', function (req, res) {
  res.render('pages/account.ejs', {session : JSON.stringify(req.session)});
});

app.get('/editAccount', function (req, res) {
  datasend = {
    name: req.session.username,
    session : JSON.stringify(req.session)
  }

  res.render('pages/editAccount.ejs', datasend);
});

app.post('/signOut', function (req, res) {
  res.send(signOut(req));
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

  req.session.eventsInterested = req.body.EventsInterested;
  db.collection('login').updateOne(query, newvalues, function (err, result) {
    if (err) throw err;
    res.send("Success");
  });

});

app.post("/updatePB", function (req, res) {

  var query = { Username: req.session.username };

  db.collection('EventInfo').updateOne(query, { $set: { PersonalBest: parseInt(req.body.personalBest) } }, function (err, result) {
    if (err) throw err;
    req.session.personalBest = parseInt(req.body.personalBest);
    res.send("Success");
  });

});

app.post("/updateLeaderboard", function (req, res) {
  var query = { Username: req.body.Username };

  var newvalues = {
    $set: {
      Leaderboard: req.body.boardUpdate
    }
  }

  db.collection('Leaderboard').updateOne(query, newvalues, function (err, result) {
    if (err) throw err;
    res.send("Success");
  });

});

app.post("/updateUserName", function (req, res) {
  req.session.username = req.body.NewUsername;
  db.collection('login').updateOne({ Username: req.body.Username }, { $set: { Username: req.body.NewUsername } }, function (err, result) {
    if (err) throw err;
    res.send(":)");
  });

});

app.post("/userSignUp", function (req, res) {

  db.collection('login').find({ "Username": req.body.Username }).toArray(function (err, result) {
    if (err) throw err;
    total = result.length;

    if (result.length == 0) {
      dataIn = {
        Username: req.body.Username,
        Password: req.body.Password,
        Admin: (req.body.Admin === "true"),
        EventsInterested: []
      }
      db.collection('login').insertOne(dataIn, function (err, result) {
        if (err) throw err;
        req.session.loggedin = true;
        req.session.username = req.body.Username;
        req.session.admin = (req.body.Admin === "true")
        req.session.personalBest = req.body.PersonalBest
        req.session.eventsInterested = []
        res.send(":)")
      });
    } else {
      res.send(":(")
    }
  });


})

app.post("/updateUserPassword", function (req, res) {

  let username = req.body.Username
  let password = req.body.Password
  let newPassword = req.body.NewPassword

  db.collection('login').find({ "Username": req.session.username }).toArray(function (err, result) {

    if (result[0]["Password"] == password) {

      db.collection('login').updateOne({ Username: username }, { $set: { Password: newPassword } }, function (err, result) {
        if (err) throw err;
        res.send("Success");
      });

    } else {
      res.send("Incorrect Password");
    }


  });


});

app.post("/deleteUser", function (req, res) {

  var user = { Username: req.body.Username, Password: req.body.Password };
  db.collection("login").deleteOne(user, function (err, obj) {
    if (err) throw err;
    res.send(signOut(req))
  });
})

app.post('/uploadPost', upload.single('photo'), (req, res) => {
  postTitle = req.body.Title;
  postBody = req.body.Body;
  img = "";

  if (req.file) {
    img = req.file["filename"];
  }

  dataIn = {
    Title : postTitle,
    Content : postBody,
    Img : img
  }

  db.collection('MainPagePosts').insertOne(dataIn, function (err, result) {
    if(err) throw err;
    res.redirect("/")
  })

});

//This is the method that checks whether the users information is correct
app.post('/loginAuth', function (request, response) {
  // Capture the input fields
  //let username = request.body.username
  //let password = request.body.psw

  let username = request.body.Username
  let password = request.body.Password

  // Ensure the input fields exists and are not empty
  if (username && password) {
    //Query the database for a person with the same username
    db.collection('login').find({ "Username": username }).toArray(function (err, result) {
      //db.collection.find({ "serialnumber" : { $exists : true, $ne : null } })
      // If there is an issue with the query, output the error
      if (err) throw err;
      //Check if if the account exists
      if (result.length == 1) {
        //Check if its the correct password
        if (result[0]["Password"] === password) {
          // Authenticate the user
          console.log("Signed In")
          
          request.session.loggedin = true;
          request.session.username = username;
          request.session.admin = result[0]["Admin"]
          request.session.eventsInterested = result[0]["EventsInterested"]
          request.session.personalBest = result[0]["PersonalBest"]
          //response.send(":)")
          response.redirect('/');
        } else {
          response.send('IncorrectPassword');
        }
      } else {
        response.end('');
      }
      response.end();
    });
  } else {
    response.send('');
    response.end();
  }
});

encPass()
function encPass(pass){

  // crypto module
  const crypto = require("crypto");
  const algorithm = "aes-256-cbc"; 

  // generate 16 bytes of random data
  const initVector = crypto.randomBytes(16);
  // secret key generate 32 bytes of random data
  Securitykey = process.env.key
    // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedData = cipher.update(message, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  console.log("Encrypted message: " + encryptedData);

}

function signOut(request) {
  if(request.session.loggedin==true){
    request.session.loggedin = false;
    delete request.session.username;
    delete request.session.admin;
    delete request.session.eventsInterested;
    delete request.session.personalBest;
  }
  console.log("Signed Out")
  return "Done :)"
}
