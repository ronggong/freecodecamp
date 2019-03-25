const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser= require("body-parser");
const path = require("path");
require("dotenv").config();
const User = require("./models/user");
const Exercise = require("./models/exercise");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.connect('mongodb://localhost/exerciseTracker', { useCreateIndex: true, useNewUrlParser: true });

app.use(express.static(__dirname + '/views'));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/views/index.html'));
// });

app.post('/api/exercise/new-user/', (req, res)=>{
    const username = req.body.username;
    if (username==='') {
        res.send('Username cannot be blank.');
    } else {
        const newUser = new User({
            username,
        });
        newUser.save((err, data)=>{
            if (err) {
                if (err.code===11000) {
                    res.send("Duplicated username.");
                } else {
                    res.send("Error in saving username.");
                }
            } else {
                res.json(data);
            }
        });
    }
});

app.listen(process.env.PORT, ()=>{
    console.log('Everything works');
});