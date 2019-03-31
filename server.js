const express = require("express");
const cors = require("cors");
var multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.static(__dirname + '/views'));

app.post('/api/fileanalyse', upload.single("upfile"), (req, res)=>{
    const file = req.file;
    res.json({name: file.originalname, type: file.mimetype, size: file.size});
});

const listener = app.listen(process.env.PORT, ()=>{
    console.log(`Your app is listening on port ${listener.address().port}`);
})