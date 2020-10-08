require("dotenv").config();

const {app} = require("./app")
const server = require("http").createServer(app);

const port = process.env.PORT;
server.listen(port, () => console.log(`listening on port ${port}`));


