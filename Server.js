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

app.get('/', function (req, res) {
  res.render('pages/index.ejs');
});

app.get("/getAnimalStats", function(req, res){
    db.collection('AnimalStats').find(req.body).toArray(function(err, result){
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  });

  app.get("/getLoginInfo", function(req, res){
      sessionInfo = {
          Username : session.username,
          Admin : session.admin
      }
    res.send(JSON.stringify(sessionInfo))
    //res.send({Username:session., admin:false});
  })

  app.get('/loginPage', function(req,res){
    res.render('pages/login.ejs')
  });

  app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
        //db.collection('AnimalStats').find(req.body).toArray(function(err, result){

           // db.collection('login').find().toArray(function(err, result){
             //   console.log(result)
            ///});
            console.log(username + "-"+password)
            db.collection('login').find({ "Username" : username}).toArray(function(err,result){
            //db.collection.find({ "serialnumber" : { $exists : true, $ne : null } })
			// If there is an issue with the query, output the error
			if (err) throw err;
			// If the account exists
            
            if(result.length == 1){
            if (result[0]["Password"]==password) {
				// Authenticate the user
				session.loggedin = true;
				session.username = username;
                session.admin = result[0]["Admin"]
				// Redirect to home page
				response.redirect('/');
                //console.log("LoggedIn")
			} else {
				response.send('Incorrect Username and/or Password!');
			}	
            }else{
                response.send('Incorrect Username and/or Password!');
            }		
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});