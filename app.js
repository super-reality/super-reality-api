require("dotenv").config();

const express = require("express");
const app = express();
const auth = require("./middleware/auth");
const morgan = require("morgan")
const fs = require("fs")
const path = require("path");
let apiRoutes = require("./routes/api/v1");


app.use(express.json());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))


// setting for local server connection from other port
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

app.use("/api/v1", apiRoutes);

module.exports = app
