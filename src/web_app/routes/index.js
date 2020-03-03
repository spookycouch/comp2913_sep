
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');

// Request parsers
var bodyParser = require('body-parser');

// Use this to handle JSON endpoints
var jsonParser = bodyParser.json();

// Use this to handle FORM endpoints
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Website header
const webname = ' The Edgy ';

/*
 *  Function:   Homepage Router
*/
router.get(['/', '/home'], function(req, res) {

    res.render(path.join(__dirname + '/../views/pages/index.ejs'),
    {
        title: webname + "| Home"
    });
});

/*
 *  Function:   Register Page Router
*/
router.get('/register', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/register.ejs'),
    {
        title: webname + "| Register"
    });
});

/*
 *  Function:   Memberships Page Router
*/
router.get('/memberships', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/memberships.ejs'),
    {
        title: webname + "| Memberships"
    });
});

/*
 *  Function:   Facilities Page Router
*/
router.get('/facilities', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
    {  
        title: webname + "| Facilities"
    });
});

/*
 *  Function:   Contact Page Router
*/
router.get('/contact', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/contact.ejs'),
    {
        title: webname + "| Contact"
    });
});

/*
 *  Function:   Login Page Router
*/
router.get('/login', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/login.ejs'),
    {
        title: webname + "| Login"
    });
});

module.exports = router;