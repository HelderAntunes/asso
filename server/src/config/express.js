const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const routes = require('../api/routes');
const responseEnhancer = require('../api/middleware/response');

/**
 * Express instance
 * @public
 */
const app = express();

// Server logging
app.use(morgan('dev'));

// Parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('json spaces', 2);

app.use(responseEnhancer({
    withStatusCode: true, // Include status code in response body.
    withStatusMessage: true, // Include status message in response body.
}));

// Lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Initialize routes
app.use('/api', routes);

module.exports = app;