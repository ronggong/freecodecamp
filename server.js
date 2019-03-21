const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const shortURL = require("./models/shortURL")
const app = express();

// app.use(bodyParser());
app.use(cors());

mongoose.connect('mongodb://localhost/shortURLs', { useNewUrlParser: true });

// find frontend static
app.use(express.static(__dirname + '/public'));

// save URL to mongoDB
// (*) is the wildcard, accept everything as urlToShorten including /
app.get('/api/shorturl/new/:urlToShorten(*)', (req, res, next) => {
    var { urlToShorten } = req.params;
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (regex.test(urlToShorten)) {
        var short = Math.floor(Math.random()*100000).toString();
        var data = new shortURL({
            originalURL: urlToShorten,
            shorterURL: short
        });
        data.save(err => {
            if (err) {
                return res.send('Error in saving data.');
            }
        });
        return res.json(data);
    }
    // failed case, URL is not valid format
    return res.json({urlToShorten: 'Failed'});
});

// redirect through short url
// if /api/shorturl/:URLToForward not working
app.get('/:URLToForward', (req, res, next) => {
    var sURL = req.params.URLToForward;
    shortURL.findOne({shorterURL: sURL}, (err, data) => {
        if (err) return res.send("Error reading the mongoDB.");
        var expression = "^(http|https)://";
        var regex = new RegExp(expression, "i");
        if (regex.test(data.originalURL)) {
            res.redirect(data.originalURL);
        } else {
            res.redirect('http://'+data.originalURL);
        }
    });
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log('Everything works.');
});