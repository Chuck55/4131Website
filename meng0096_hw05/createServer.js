const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');

http.createServer(function (req, res) {
	  console.log(req.url)
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if(req.url === '/'){
    indexPage(req,res);
  }
  else if(req.url === '/index.html'){
    indexPage(req,res);
  }
  else if(req.url === '/contact.html'){
    contactPage(req,res);
  }
  else if(req.url === '/addContact.html'){
    addContactPage(req,res);
  }
  else if (req.url === '/contact.json'){
  console.log("Yo man")
	returnJSON(req,res);
  }
  else if (req.url === '/postContactEntry') {
      postData(req, res);
  }
  else if (req.url === '/stock.html'){
    stock(req, res);
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end("404 Not Found");
  }
}).listen(9001);

function stock(req, res){
  fs.readFile('client/stock.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function indexPage(req, res) {
  fs.readFile('client/index.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function contactPage(req, res) {
  fs.readFile('client/contact.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function addContactPage(req, res) {
  fs.readFile('client/addContact.html', function(err, html) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
  });
}
function returnJSON(req, res) {
  fs.readFile('contact.json', function(err, json) {
    if(err) {
      throw err;
    }
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.write(json);
    res.end();
  });
}
function postData (req, res){
	let body = [];
	req.on('data', (chunk) => {
	  body.push(chunk);
	}).on('end', () => {
	  body = Buffer.concat(body).toString();
	  // at this point, `body` has the entire request body stored in it as a string
	});
	fs.readFile('contact.json', function(err, json) {
		if(err) {
			throw err;
  }		
  var objBody = qs.parse(body);
  var nameValue = decodeURI(objBody.contactName);
  var emailValue = decodeURI(objBody.email);
  var addressValue = decodeURI(objBody.address);
  var phoneValue = decodeURI(objBody.phoneNumber);
  var placeValue = decodeURI(objBody.favoritePlace);
  var URLValue = decodeURI(objBody.favoritePlaceURL);
		var name = ',{"name":"' + nameValue + '",';
		var email = '"email":"' + emailValue + '",';
		var address = '"address":"' + addressValue + '",';
		var phoneNumber = '"phoneNumber":"' + phoneValue + '",';
    var favoritePlace = '"favoritePlace":"' + placeValue + '",';
    var favoriteURL = '"favoritePlaceURL":"' + URLValue + '"}';

		var total = name + email + address + phoneNumber + favoritePlace +favoriteURL;
		var fd = fs.openSync('contact.json', 'r+');
    var result = json.slice(0, -3) + total + json.slice(-3);
    console.log("This is ::" + json.slice(0, -3));
    console.log("This is ::" +total);
    console.log("This is ::" +json.slice(-3));

		fs.writeFile(fd, result, noop);
	});
	fs.readFile('client/contact.html', function(err, html) {
		if(err) {
		throw err;
    }
    res.writeHead(302, {
      'Location': '/contact.html',
      'Content-Type': 'text/html'
    });
		res.end();
	});
}
const noop = () => {};

//extract the information -
//make a json object string out of post data
//read in the file contact.jsonadd post data string to contact.json string write the updated string back out to contact.json
//redirect as per the slide at the beginning of this lecture
