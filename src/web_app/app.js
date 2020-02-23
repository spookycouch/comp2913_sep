// Port
const hostname = '127.0.0.1';
const port = 3000;

// Packages
var express = require('express');
var app = express();
var path = require('path');
var routes = require('./routes/index');
const request = require('request');
var user = require('./modules/user.js');


// Descriptive
const webname = ' The Edgy ';

// Components
app.use(express.static('src'));  // Used to make the resources accessible (css etc.)
app.use('/',routes);
app.set('view engine', 'ejs');


// Run the app
app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});