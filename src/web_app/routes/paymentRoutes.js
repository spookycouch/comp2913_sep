const express = require('express');
const validation = require('../modules/validation');
const jwt = require('jsonwebtoken');
var path = require('path');
const router = express.Router();
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var error = require('../modules/error');
var report = require('../modules/report');
var facility = require('../modules/facility');
var employee = require('../modules/employee');
var busboy = require('busboy');
var fs = require('fs');


// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csurf({ cookie: true }));


// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Booking payment page
*/
router.get('/booking/:id*', function(req, res) {
    if (req.session.userId == undefined) {
        req.session.from = "/payment/" + req.url;
        res.redirect('/user/login');
    } else {
        user.getActivity(req.params['id']).then(function(result) {
            res.render(path.join(__dirname + '/../views/pages/payment/payment-booking.ejs'), 
            {
                title: webname + "| Payment | Booking",
                session: req.session,
                activity: result
            });

        }).catch(function(err) {
            console.log(err);
            res.redirect('/home')
        });
    }
});


/*
 *  Function:   Membership payment page
*/
router.get('/membership/:id*', function(req, res) {
    
    // If user not logged in -> store url intent -> redirect login
    if (req.session.userId == undefined) {
        
        req.session.from = "/payment/" + req.url;
        res.redirect('/user/login');

    // Else render payment page
    } else {
        
        res.render(path.join(__dirname + '/../views/pages/payment/payment-membership.ejs'),
        {
            title: webname + "| Payment | Membership",
            session: req.session
        });
    }
});


module.exports = router;
