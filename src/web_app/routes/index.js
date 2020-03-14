
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

    async function genFromDB() { 
        var no_items = 7;
        var page_no = 1;

        user.facilities(no_items, page_no).then(function (results) {
            res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
            {
                no_items: no_items,
                page_no: page_no,
                no_pages: Math.ceil(results[0][0].count/no_items),
                total: results[0][0].count,
                results: results[1],
                title: webname + "| Facilities",
                session: req.session,
                csrfToken: req.csrfToken()
            });

        }).catch(function(err){
           
            console.log(err);
        });
    }

    genFromDB();
});

/*
 *  Function:   Facilities Page Router
*/
router.post('/facilities/discover', csrf, function(req, res) {

    async function genFromDB() { 
        var id = parseInt(req.body.id);

        user.facilities_discover(id).then(function (results) {
            res.render(path.join(__dirname + '/../views/pages/facilities_discover.ejs'),
            {
                facility: results[0],
                images: results[1],
                title: webname + "| Facilities",
                session: req.session,
                csrfToken: req.csrfToken()
            });

        }).catch(function(err){
           
            console.log(err);
        });
    }

    genFromDB();
});

/*
 *  Function:   Facilities Page Router
*/
router.post('/facilities', csrf, function(req, res) {

    async function genFromDB() { 
        var no_items = parseInt(req.body.no_items);
        var page_no = parseInt(req.body.page_no);

        user.facilities(no_items, page_no).then(function (results) {
            res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
            {
                no_items: no_items,
                page_no: page_no,
                no_pages: Math.ceil(results[0][0].count/no_items),
                total: results[0][0].count,
                results: results[1],
                title: webname + "| Facilities",
                session: req.session,
                csrfToken: req.csrfToken()
            });

        }).catch(function(err){
           
            console.log(err);
        });
    }

    genFromDB();
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

router.get('/activities', csrf, function(req, res) {
    var no_items = 7;
    var page_no = 1;

    user.upcomingActivities(no_items, page_no).then(function (results) {
        res.render(path.join(__dirname + '/../views/pages/activities.ejs'),
        {
            no_items: no_items,
            page_no: page_no,
            no_pages: Math.ceil(results[0][0].count/no_items),
            total: results[0][0].count,
            results: results[1],
            session: req.session,
            csrfToken: req.csrfToken()
        });

    }).catch(function(err){
        
        console.log(err);
    });

});


/*
 * Function:    Test new activity
*/
router.get('/activities/new', csrf, function (req, res) {
    return res.render(path.join(__dirname + '/../views/pages/activities_new.ejs'));
})

/*
 * Function:    Test new facility
*/
router.get('/facilities/new', csrf, function (req, res) {
    return res.render(path.join(__dirname + '/../views/pages/facilities_new.ejs'));
})


/*
 *  Function:   Facilities Page Router
*/
router.post('/activities', csrf, function(req, res) {

    var no_items = parseInt(req.body.no_items);
    var page_no = parseInt(req.body.page_no);

    user.upcomingActivities(no_items, page_no).then(function (results) {
        res.render(path.join(__dirname + '/../views/pages/activities.ejs'),
        {
            no_items: no_items,
            page_no: page_no,
            no_pages: Math.ceil(results[0][0].count/no_items),
            total: results[0][0].count,
            results: results[1],
            session: req.session,
            csrfToken: req.csrfToken()
        });

    }).catch(function(err){
        
        console.log(err);
    });
});


module.exports = router;