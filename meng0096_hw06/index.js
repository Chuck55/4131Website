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

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

// // GET method route for the contact page.
// It serves contact.html present in client folder
app.get('/contact',function(req, res) {
  //Add Details
});

// GET method route for the addContact page.
// It serves addContact.html present in client folder
app.get('/addContact',function(req, res) {
  //Add Details
});
//GET method for stock page
app.get('/stock', function (req, res) {
  //Add Details
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  //Add Details
});

// GET method to return the list of contacts
// The function queries the tbl_contacts table for the list of contacts and sends the response back to client
app.get('/getListOfContacts', function(req, res) {
  //Add Details
});

// POST method to insert details of a new contact to tbl_contacts table
app.post('/postContact', function(req, res) {
  //Add Details
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  //Add Details
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  //Add Details
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
});
