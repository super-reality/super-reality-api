require("dotenv").config();

const mongoose = require("mongoose");
mongoose.Promise = Promise;
const database = mongoose.connection;
database.on("error", () => console.error("database connection error"));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const app= require("./app")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configuration/swagger')

// use swagger-Ui-express for your app documentation endpoint
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = require("http").createServer(app);

const port = process.env.PORT;
server.listen(port, () => console.log(`listening on port ${port}`));
