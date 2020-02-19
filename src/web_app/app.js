// Port
const hostname = '127.0.0.1';
const port = 3000;

// Packages
var express = require('express');
var app = express();
var path = require('path');
const request = require('request');


// Descriptive
const webname = ' Sports Centre ';

// Components


app.use(express.static('src'));  // Used to make the resources accessible (css etc.)
app.set('view engine', 'ejs');


// Routes
app.get(['/', '/home'], function(req, res) {
    res.render(path.join(__dirname + '/views/pages/index.ejs'),
    {
        title: webname + "| Home"
    });
});

app.get('/login', function(req, res) {
    res.render(path.join(__dirname + '/views/pages/login.ejs'),
    {
        title: webname + "| Login"
    });
});

app.get('/memberships', function(req, res) {
    res.render(path.join(__dirname + '/views/pages/memberships.ejs'),
    {
        title: webname + "| Memberships"
    });
});


app.get('/facilities', function(req, res) {
    res.render(path.join(__dirname + '/views/pages/facilities.ejs'),
    {
        title: webname + "| Facilities"
    });
});

app.get('/contact', function(req, res) {
    res.render(path.join(__dirname + '/views/pages/contact.ejs'),
    {
        title: webname + "| Contact"
    });
});


// Run the app
app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});