
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
        title: webname + "| Home",
        session: req.session
    });
});

/*
 *  Function:   Memberships Page Router
*/
router.get('/memberships', csrf, function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/memberships.ejs'),
    {
        title: webname + "| Memberships",
        session: req.session
    });
});

/*
 *  Function:   Facilities Page Router
*/
router.get('/facilities', csrf, function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
    {  
        title: webname + "| Facilities",
        session: req.session
    });
});

/*
 *  Function:   Contact Page Router
*/
router.get('/contact', csrf, function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/contact.ejs'),
    {
        title: webname + "| Contact",
        session: req.session
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

/*
 *  Function:   Facilities Page Router
*/
router.get('/activities', csrf, function(req, res) {

    async function genFromDB() { 
        var no_items = 10;
        var page_no = 0;

        if (req.body.hasOwnProperty('no_items') && req.body.hasOwnProperty('page_no')) {
            no_items = req.body.no_items;
            page_no = req.body.page_no - 1;
        }

        user.upcomingActivities(no_items, page_no).then(function (results) {
            
            res.end(results[0][0].count.toString() + ' activities were found');

        }).catch(function(err){
           
            reject(err);
        });
    }

    genFromDB();

    // res.render(path.join(__dirname + '/../views/pages/activities.ejs'),
    // {  
    //     title: webname + "| Facilities",
    //     session: req.session
    // });
});

module.exports = router;