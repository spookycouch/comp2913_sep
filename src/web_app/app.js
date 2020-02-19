// Port
const hostname = '127.0.0.1';
const port = 3000;

// Packages
var express = require('express');
var app = express();
var path = require('path');
const request = require('request');

// Components


app.use(express.static('src'));  // Used to make the resources accessible (css etc.)
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    res.render(path.join(__dirname + '/views/pages/index.ejs'),
    {
        title: "home"
    });
});




app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}/`);
});