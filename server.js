// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
// app.use(express.static('public'));
app.use(cors());

// http://expressjs.com/en/starter/basic-routing.html
app.get('/api/timestamps/:date_string?', function(req, res, next) {
  // acquire the date string of the input
  var date_string = req.params.date_string;
  
  if (date_string === "") {
    // current date
    var date = new Date();
  } else if (isNaN(date_string)) {
    // UTC time format
    var date = new Date(date_string);
  } else {
    // a unix date format
    var date = new Date(date_string*1000)
  }
  
  // make it can accept the unix timestamp
  if (date.getTime()) {
    res.json({unix: date.getTime(), utc : date.toUTCString()});
  } else {
    res.json({"error" : "Invalid Date" });
  }

});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
