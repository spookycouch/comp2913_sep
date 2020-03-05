
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csurf({ cookie: true }));

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
router.get('/user/register', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/register.ejs'),
    {
        title: webname + "| Register",
        form: req.body,
        csrfToken: req.csrfToken()
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
router.get('/user/login', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/login.ejs'),
    {
        title: webname + "| Login",
        form: req.body,
        csrfToken: req.csrfToken()
    });
});

module.exports = router;