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

app.post('/api/exercise/add/', (req, res)=>{
    const username = req.body.username;
    const description = req.body.description;
    let duration = req.body.duration;
    let date = req.body.date;
    let userId;

    if (username===undefined || description===undefined || duration===undefined) {
        res.send('Required field cannot be undefined.');
    } else if (username==='' || username==='' || duration==='') {
        res.send('Requires field cannot be blank.');
    } else if (isNaN(duration)) {
        res.send('Duration should be a number.');
    } else if (date != '' && isNaN(Date.parse(date))===true) {
        res.send('Date is not required format.')
    } else {
        User.findOne({username: username}, (err, user)=>{
            if (err) return res.send("Error reading in mongoDB");
            userId = user.id;
            duration = Number(duration);
            if (date==='') {
                date = new Date();
            } else {
                date = Date.parse(date);
            }
            const newExercise = new Exercise({
                userId,
                description,
                duration,
                date
            });
            newExercise.save((err, data)=>{
                if (err) {
                    res.send("Error in saving exercise.");
                } else {
                    res.json(data);
                }
            });
        });
    }
});

app.get('/api/exercise/:log', (req, res)=>{
    const username = req.query.username;
    let from = req.query.from;
    let to = req.query.to;
    let limit = req.query.limit;
    let userId;
    const query = {};

    if (username===undefined) {
        res.send("Username cannot be undefined"); 
    } else if (username==='') {
        res.send("Username cannot be blank.");
    } else if (from !== undefined && isNaN(Date.parse(from))===true) {
        res.send("Not a valid from date.");
    } else if (to !== undefined && isNaN(Date.parse(to))===true) {
        res.send("Not a valid to date.");
    } else if (limit !== undefined && isNaN(Date.parse(limit))===true) {
        res.send("Limit is a valid number.");
    } else if (limit !== undefined && limit < 1) {
        res.send("Limit should be > 0.");
    } else {
        User.findOne({username: username}, (err, user) => {
            if (err) return res.send("Error reading in mongoDB");
            userId = user.id;
            query.userId = userId;

            if (from !== undefined) {
                from = new Date(from);
                query.date = {$gte: from};
            }

            if (to !== undefined) {
                to = new Date(to);
                to.setDate(to.getDate() + 1);
                query.date.$lt = to;
            }

            if (limit !== undefined) {
                limit = Number(limit);
            }

            Exercise.find(query).select('userId description duration date').limit(limit).exec((err, exercises)=>{
                if (err) return res.send("Error reading userId in mongoDB");
                res.json(exercises);
            });
        });
    }
});

app.listen(process.env.PORT, ()=>{
    console.log('Everything works');
});