// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");
var loginRight = false;
// apply the body-parser middleware to all incoming requests
app.use(bodyparser());
app.use( bodyparser.json() );       // to support JSON-encoded bodies
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
app.listen(9096, () => console.log('Listening on port 9007!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

// // GET method route for the contact page.
// It serves contact.html present in client folder
app.get('/contact',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/client/contact.html');
  }
});

// GET method route for the addContact page.
// It serves addContact.html present in client folder
app.get('/addContact',function(req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/client/addContact.html');
  }
});
//GET method for stock page
app.get('/stock', function (req, res) {
  if (!req.session.value) {
    res.redirect('/login');
  } else {
    res.sendFile(__dirname + '/client/stock.html');
  }
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  if (req.session.value) {
    res.redirect('/contact');
  } else {
    res.sendFile(__dirname + '/client/login.html');
  }
});

// GET method to return the list of contacts
// The function queries the tbl_contacts table for the list of contacts and sends the response back to client
app.get('/getListOfContacts', function(req, res) {
  var con = mysql.createConnection({
    host: "cse-larry.cse.umn.edu",
    user: "C4131S20U78", // replace with the database user provided to you
    password: "6114", // replace with the database password provided to you
    database: "C4131S20U78", // replace with the database user provided to you
    port: 3306
  });
  
  con.connect(function(err) {
    if (err) {
      throw err;
    }; 
    con.query("SELECT * FROM tbl_contacts", function (err, result, fields) {
    if (err){
      throw err;
    }
    var contacts = {
      contact: []
    };
    for(var i in result) {    
      var person = result[i];   
      contacts.contact.push({ 
          "name" : person.contact_name,
          "email"  : person.contact_email,
          "address"       : person.contact_address,
          "phoneNumber"       : person.contact_phone,
          "favoritePlace"       : person.contact_favoriteplace,
          "favoritePlaceURL"       : person.contact_favoriteplaceurl
      });
    }
      res.set('Content-Type', 'text/plain');
      res.status(200).json(contacts);
    })
  });
});
// POST method to insert details of a new contact to tbl_contacts table
app.post('/postContact', function(req, res) {
  var con = mysql.createConnection({
    host: "cse-larry.cse.umn.edu",
    user: "C4131S20U78", // replace with the database user provided to you
    password: "6114", // replace with the database password provided to you
    database: "C4131S20U78", // replace with the database user provided to you
    port: 3306
  });
  
  con.connect(function(err) {
    if (err) {
      throw err;
    }; 
    
      var bod = req.body;
      var name = bod.contactName;
      var email = bod.email;
      var address = bod.address;
      var phone = bod.phoneNumber;
      var favoriteplace = bod.favoritePlace;
      var favoriteplaceURL = bod.favoritePlaceURL;
      var first = "INSERT INTO tbl_contacts (contact_name, contact_email, contact_address, contact_phone, contact_favoriteplace, contact_favoriteplaceurl) VALUES ";
      var second =  "('" + name + "','" + email + "','" + address+ "','" +phone+ "','" +favoriteplace+ "','" +favoriteplaceURL + "')";
      var sql = first + second;

      con.query(sql, function (err, result) {
        if (err){
          throw err;
        }
        console.log("1 record inserted");
        res.redirect('/contact');
      });
  });
});


// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) { 
  var bod = req.body;
  var con = mysql.createConnection({
    host: "cse-larry.cse.umn.edu",
    user: "C4131S20U78", // replace with the database user provided to you
    password: "6114", // replace with the database password provided to you
    database: "C4131S20U78", // replace with the database user provided to you
    port: 3306
  });
  
  con.connect(function(err) {
    if (err) {
      throw err;
    }; 
    con.query("SELECT * FROM tbl_accounts", function (err, result, fields) {
      if (err){
        throw err;
      }
      var x = 0;
      var found = false;
      var username = req.body.Username;
      var sess = req.session;
      var password = crypto.createHash('sha256').update(req.body.Password).digest('base64');
      for(x = 0; x < result.length; x++) {
          resu = result[x];
          if ((resu.acc_login==username) && (resu.acc_password==password)) {
            sess.value = 1;
			sess.save();
			res.write(JSON.stringify({Stuff:true}));
			res.end();
			found = true;
          }
      }
	  if (!found) {
      	res.write(JSON.stringify({Stuff:false}));
		res.end();
	  }
    })
  });
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/login');
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  res.sendStatus(404);
});
