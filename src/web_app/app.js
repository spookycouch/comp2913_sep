// Port
const hostname = '127.0.0.1';
const port = 3000;

// Packages
var express = require('express');
var app = express();
var path = require('path');
const request = require('request');
var user = require('./modules/user.js');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var routes = require('./routes/index');
var user = require('./routes/userRoutes.js');
var api = require('./routes/api.js');
var ajax = require('./routes/ajax.js');

// Descriptive
const webname = ' The Edgy ';

// Engine
app.use(express.static('src'));  // Used to make the resources accessible (css etc.)
app.set('view engine', 'ejs');

// Parsing
app.use(express.json()); //Used to parse JSON POST
app.use(cookieParser());

// Routes
app.use('/',routes);
app.use('/user',user);
app.use('/api',api);
app.use('/ajax',ajax);

// Run the app
app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});