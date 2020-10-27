const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    title: 'Super Reality Api', // Title of the documentation
    version: '1.0.0', // Version of the app
    description: 'Convert your reality to super reality', // short description of the app
  },
  host: '54.219.193.178', // the host or url of the app// the basepath of your endpoint
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./docs/**/*.yaml'],
};
// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);
