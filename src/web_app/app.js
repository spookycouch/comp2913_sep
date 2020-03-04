// Port
const hostname = '127.0.0.1';
const port = 3000;

// Packages
var express = require('express');
var app = express();
var path = require('path');
var routes = require('./routes/index');
var userRoutes = require('./routes/userRoutes.js');
const request = require('request');
var user = require('./modules/user.js');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');



// Descriptive
const webname = ' The Edgy ';

// Components

app.use(express.json()); //Used to parse JSON POST
app.use(express.static('src'));  // Used to make the resources accessible (css etc.)
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));
app.use('/',routes);
app.use('/user',userRoutes);

// Run the app
app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});