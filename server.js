require("dotenv").config();
const User = require('./models/user')
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const auth = require("./middleware/auth");

const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
let apiRoutes = require("./routes/api/v1/");

const { hashDigest, hashSaltDigest } = require("./utilities/hashing");



app.use(express.json())

//ADDED BY MATT---------------------------
const userRouter = require('./routes/api/v1/user')
const collectionRouter = require('./routes/api/v1/collection')
app.use(userRouter)
app.use(collectionRouter)
//------------------------------------------



app.use(express.json());
console.log('FUUCK: ', process.env.MONGO_URL);

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
const port = process.env.PORT;

server.listen(port);
// database.on("error");

// server.listen(port, () => console.log(`listening on port ${port}`));
// database.on("error", () => console.error("database connection error"));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false
});



module.exports = app
    // module.exports = { server }
