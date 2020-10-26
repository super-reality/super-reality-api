
const express = require("express");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configuration/swagger')

// use swagger-Ui-express for your app documentation endpoint
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const server = require("http").createServer(app);

const port = 3002
server.listen(3002, () => console.log(`listening on port ${port}`));
