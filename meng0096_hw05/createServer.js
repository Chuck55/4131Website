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
	returnJSON(req,res);
  }
  else if (req.url === '/postContactEntry') {
      postData(req, res);
  }
  else{
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end("404 Not Found");
  }
}).listen(9001);


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
    var name1 = body.search("contactName");
    var name2 = (body.substring(name1)).search("=");
    var name3 = (body.substring(name1)).search("&");
    var nameValue = (body.substring(name1)).substring(name2+1, name3);

    var email1 = body.search("email");
    var email2 = (body.substring(email1)).search("=");
    var email3 = (body.substring(email1)).search("&");
    var emailValue = (body.substring(email1)).substring(email2+1, email3);

    var address1 = body.search("address");
    var address2 = (body.substring(address1)).search("=");
    var address3 = (body.substring(address1)).search("&");
    var addressValue = (body.substring(address1)).substring(address2+1, address3);

    var phone1 = body.search("phoneNumber");
    var phone2 = (body.substring(phone1)).search("=");
    var phone3 = (body.substring(phone1)).search("&");
    var phoneValue = (body.substring(phone1)).substring(phone2+1, phone3);

    var place1 = body.search("favoritePlace");
    var place2 = (body.substring(place1)).search("=");
    var place3 = (body.substring(place1)).search("&");
    var placeValue = (body.substring(place1)).substring(place2+1, place3);

    var URL1 = body.search("favoritePlaceURL");
    var URL2 = (body.substring(URL1)).search("=");
    var URL3 = (body.substring(URL1)).search("&");
    var URLValue = (body.substring(URL1)).substring(URL2+1);

		var name = ',{"name":"' + nameValue + '",';
		var email = '"email":"' + emailValue + '",';
		var address = '"address":"' + addressValue + '",';
		var phoneNumber = '"phoneNumber":"' + phoneValue + '",';
    var favoritePlace = '"favoritePlace":"' + placeValue + '",';
    var favoriteURL = '"favoritePlaceURL":"' + URLValue + '"}';

		var total = name + email + address + phoneNumber + favoritePlace +favoriteURL;
		var fd = fs.openSync('contact.json', 'a+');
		var result = json.slice(0, -3) + total + json.slice(-3);
		fs.writeFile(fd, result, noop);
	});
	fs.readFile('client/contact.html', function(err, html) {
		if(err) {
		throw err;
    }
    res.writeHead(302, {
      'Location': 'client/contact.html',
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
