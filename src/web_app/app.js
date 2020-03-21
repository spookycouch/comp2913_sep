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
var del = require('./routes/delete.js');
var manager = require('./routes/managerRoutes.js');
var error = require('./modules/error.js');

// Descriptive
const webname = ' The Edgy ';

// Engine
app.use(express.static('src'));  // Used to make the resources accessible (css etc.)
app.set('view engine', 'ejs');

// Parsing
app.use(express.json()); //Used to parse JSON POST
app.use(cookieParser());

// Routes
app.use('/', routes);
app.use('/user', user);
app.use('/api', api);
app.use('/ajax', ajax);
app.use('/delete', del);
app.use('/manager', manager);

// Error 404
app.get('*', function(req, res){
    res.status(404).render(path.join(__dirname + '/views/pages/error-404.ejs'));
});

// Run the app
app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});