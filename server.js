const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.static(__dirname + '/views'));

const listener = app.listen(process.env.PORT, ()=>{
    console.log(`Your app is listening on port ${listener.address().port}`);
})