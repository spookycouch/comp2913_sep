
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('client-sessions');

var csrf = csurf({ cookie: true });

// Session
router.use(session({
    cookieName: 'session',
    secret: 'yellowpuddingcoronapspreading',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));


// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Website header
const webname = ' The Edgy ';

/*
 *  Function:   Homepage Router
*/
router.get(['/', '/home'], csrf, function(req, res) {

    res.render(path.join(__dirname + '/../views/pages/index.ejs'),
    {
        title: webname + "| Home"
    });
});

/*
 *  Function:   Memberships Page Router
*/
router.get('/memberships', csrf, function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/memberships.ejs'),
    {
        title: webname + "| Memberships"
    });
});

/*
 *  Function:   Facilities Page Router
*/
router.get('/facilities', csrf, function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
    {  
        title: webname + "| Facilities"
    });
});

/*
 *  Function:   Contact Page Router
*/
router.get('/contact', csrf, function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/contact.ejs'),
    {
        title: webname + "| Contact"
    });
});

/*
 *  Function:   Login Page Router
*/
router.get('/user/login', csrf, function(req, res) {

    // Check logged user
    if(req.session.userId != undefined)
        res.redirect('/user/account');

    else {
        // Otherwise render login page
        res.render(path.join(__dirname + '/../views/pages/login.ejs'),
        {
            title: webname + "| Login",
            form: req.body,
            csrfToken: req.csrfToken()
        });
    }
});

module.exports = router;