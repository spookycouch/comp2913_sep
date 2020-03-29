
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('client-sessions');
var facility = require('../modules/facility');


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

    var no_items = 6;
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

});

/*
 *  Function:   Facilities Page Router
*/
router.post('/facilities', csrf, function(req, res) {

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

});

/*
 *  Function:   Facilities Page Router
*/
router.get('/facilities/discover', csrf, function(req, res) {

    var facilityId = parseInt(req.query.id);
    var currentDate = new Date();

    var week = new Array(); 
    currentDate.setDate((currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() == 0 ? -6 : 1)));
    for (var i = 0; i < 7; i++) {
        week.push(new Date(currentDate).toDateString()); 
        currentDate.setDate(currentDate.getDate() +1);
    }
   
    var currentDate = new Date();
    var today = (currentDate.getDay() + (currentDate.getDay() == 0 ? 6 : -1));

    user.facilities_discover(facilityId).then(function(results) {

        user.facilities_timetable(facilityId, currentDate).then(function(timetable) {
            res.render(path.join(__dirname + '/../views/pages/facilities_discover.ejs'),
            {
                facility: results[0],
                images: results[1],
                title: webname + "| Facilities",
                session: req.session,
                csrfToken: req.csrfToken(),
                week: week,
                today: today,
                timetable: timetable
            });
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err){
        
        console.log(err);
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
 *  Function:   Activities page
*/
router.get('/activities', csrf, function(req, res) {
    var currentDate = new Date();

    // default values
    var no_items = 7;
    var page_no = 1;
    var filters = {};
    filters['start_date'] = currentDate.getFullYear() + '-' +
                            currentDate.getMonth() + '-' +
                            currentDate.getDate() + ' ' +
                            currentDate.getHours() + ':' +
                            currentDate.getMinutes() + ':' +
                            currentDate.getSeconds();
    
    // passed as parameters
    if (req.query.no_items && req.query.page_no) {
        no_items = parseInt(req.query.no_items);
        page_no = parseInt(req.query.page_no);
    }
    if (req.query.sport)
        filters['sport'] = req.query.sport;
    if (req.query.facility)
        filters['facility'] = req.query.facility;
    if (req.query.start_date)
        filters['start_date'] = req.query.start_date;
    if (req.query.end_date)
        filters['end_date'] = req.query.end_date;


    var week = new Array(); 
    currentDate.setDate((currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() == 0 ? -6 : 1)));
    for (var i = 0; i < 7; i++) {
        week.push(new Date(currentDate).toDateString()); 
        currentDate.setDate(currentDate.getDate() +1);
    }
   
    var currentDate = new Date();
    var today = (currentDate.getDay() + (currentDate.getDay() == 0 ? 6 : -1));

    user.upcomingActivities(no_items, page_no, filters).then(function(results) {
        user.activitiesTimetable(currentDate).then(function(timetable) {
            facility.getAllSports().then(function(sports) {
                facility.getAllFacilities().then(function(facilities) {
                    res.render(path.join(__dirname + '/../views/pages/activities.ejs'),
                    {
                        no_items: no_items,
                        page_no: page_no,
                        no_pages: Math.ceil(results[0][0].count/no_items),
                        total: results[0][0].count,
                        filters: filters,
                        results: results[1],
                        title: webname + "| Activities",
                        session: req.session,
                        csrfToken: req.csrfToken(),
                        week: week,
                        today: today,
                        timetable: timetable,
                        sports: sports,
                        facilities: facilities
                    });
                }).catch(function(err) {
                    console.log(err);
                    res.redirect('/home');
                });
                
            }).catch(function(err) {
                console.log(err);
                res.redirect('/home');
            });
        
        }).catch(function(err) {
            console.log(err);
            res.redirect('/home');
        }); 

    }).catch(function(err){
        console.log(err);
        res.redirect('/home');
    });

});


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
            title: webname + "| Activities",
            session: req.session,
            csrfToken: req.csrfToken()
        });

    }).catch(function(err){
        
        console.log(err);
    });
});

module.exports = router;