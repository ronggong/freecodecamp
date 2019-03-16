// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/api/whoami', function(req, res) {
  var lang = req.headers["accept-language"];
  var software = req.headers["user-agent"];
  var ipaddress = req.ip;
  res.json({"ipaddress": ipaddress, 
            "language": lang,
            "software": software
           });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
