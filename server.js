const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
// import mongoose from "mongoose";

const app = express();

// app.use(bodyParser());
app.use(cors());

// find frontend static
app.use(express.static(__dirname + '/public'));

// (*) is the wildcard, accept everything as urlToShorten including /
app.get('/api/shorturl/new/:urlToShorten(*)', (req, res, next) => {
    var { urlToShorten } = req.params;
    return res.json({urlToShorten});
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log('Everything works.');
});