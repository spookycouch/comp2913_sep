
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const validation = require('../modules/validation');
const report = require('../modules/report');
const facility = require('../modules/facility');
var employee = require('../modules/employee');


var urlEncoded = bodyParser.urlencoded({ extended: true });
var jsonEncoded = bodyParser.json();

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));

// Website header
const webname = ' The Edgy ';

/*
 *  Function:   Register Backend Query (for Registration subform 1)
*/
router.post('/register/response-1', function(req, res) {
    
    try {
        const value = validation.registerValidation1(req.body);   

        // Error
        if(value.error != undefined)
            throw value.error.details;
        
        // Email check
        user.checkEmailRegistered(req.body.email).then(function(result) {

            // Email already existing
            if(result == true) throw [{
                message: 'Email already registered',
                path: 'email'
            }];

             // Response
            res.end(JSON.stringify({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                confirm_password: req.body.confirm_password
            }));

        }).catch(function(err){

            // Error
           res.end(JSON.stringify({
                error: err
            }));

        });

    } catch(err) {

        // Error
        res.end(JSON.stringify({
            error: err
        }));
    }
});


/*
 *  Function:   Register Backend Query (for Registration subform 2)
*/
router.post('/register/response-2', function(req, res) {
    
    try {
        const value = validation.registerValidation2(req.body);

        // Error
        if(value.error != undefined)
            throw value.error.details;

        res.end(JSON.stringify({
            birth: req.body.birth,
            phone: req.body.phone
        }));

    } catch(err) {

        res.end(JSON.stringify({
            error: err
        }));
    }
});


/*
 *  Function:   Register Backend Query (for Registration subform 3)
*/
router.post('/register/response-3', function(req, res) {
    try {
        const value = validation.registerValidation3(req.body);
        
        // Error
        if(value.error != undefined)
            throw value.error.details;

        res.end(JSON.stringify({
            address_1: req.body.address_1,
            address_2: req.body.address_2,
            city: req.body.city,
            zipcode: req.body.zipcode
        }));

    } catch(err) {

        res.end(JSON.stringify({
            error: err
        }));
    }
});

/*
 *  Function:   Facilities Timetable
*/
router.post('/facility/timetable', function(req, res) {
    date = new Date(req.body.date);

    user.facilities_timetable(req.body.id, date).then(function(timetable) {
        res.end(JSON.stringify({
            results: timetable
        }));
        
    }).catch(function(err) {

        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Activities Timetable
*/
router.post('/activities/timetable', function(req, res) {
    date = new Date(req.body.date);

    user.activitiesTimetable(date).then(function(timetable) {
        res.end(JSON.stringify({
            results: timetable
        }));
        
    }).catch(function(err) {

        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Activity Weekly Usage
*/
router.get('/report/overall/activity/:id*', function(req, res) {
    
    id = req.params['id'];

    report.getOverallActivityUsage(id).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Activity Weekly Usage
*/
router.post('/report/weekly/activity/', function(req, res) {
    
    // Data
    let id = req.body.id;
    let start = req.body.start;
    let end = req.body.end;

    // Query
    report.getWeeklyActivityUsage(id, start, end).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Get all activities
*/
router.get('/data/activity/all', function(req, res) {
    
    id = req.params['id'];

    facility.getAllActivities().then(function(results){

        // Render
        res.end(JSON.stringify({
            activities: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Get all facilities
*/
router.get('/data/facility/all', function(req, res) {
    
    id = req.params['id'];

    facility.getAllFacilities().then(function(results){

        // Render
        res.end(JSON.stringify({
            facilities: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Get all sports
*/
router.get('/data/sport/all', function(req, res) {
    
    id = req.params['id'];

    facility.getAllSports().then(function(results){

        // Render
        res.end(JSON.stringify({
            sports: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Activity Weekly Usage
*/
router.get('/report/overall/facility/:id*', function(req, res) {
    
    id = req.params['id'];

    report.getOverallFacilityUsage(id).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Activity Weekly Usage
*/
router.post('/report/weekly/facility/', function(req, res) {
    
    // Data
    let id = req.body.id;
    let start = req.body.start;
    let end = req.body.end;

    // Query
    report.getWeeklyFacilityUsage(id, start, end).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Sport Weekly Usage
*/
router.get('/report/overall/sport/:id*', function(req, res) {
    
    id = req.params['id'];

    report.getOverallSportUsage(id).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Activity Weekly Usage
*/
router.post('/report/weekly/sport/', function(req, res) {
    
    // Data
    let id = req.body.id;
    let start = req.body.start;
    let end = req.body.end;

    // Query
    report.getWeeklySportUsage(id, start, end).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});

/*
 *  Function:   Login Weekly Usage
*/
router.post('/report/usage/weekly/', function(req, res) {

    // Data
    let start = req.body.start;
    let end = req.body.end;

    report.getLoginActivity(start, end).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});


router.post('/delete/image/activity', function(req, res) {
    employee.deleteActivityImage(req.body.activityId, req.body.imageId).then(function() {
        employee.getActivityImages(req.body.activityId).then(function(result) {

            res.end(JSON.stringify({
                results: result
            }));

        }).catch(function(err) {
            res.end(JSON.stringify({
                error: err
            }));
        })

    }).catch(function(err) {
        res.end(JSON.stringify({
            error: err
        }));
    })
});


router.post('/delete/image/facility', function(req, res) {
    employee.deleteFacilityImage(req.body.facilityId, req.body.imageId).then(function() {
        employee.getFacilityImages(req.body.facilityId).then(function(result) {
            res.end(JSON.stringify({
                results: result
            }));

        }).catch(function(err) {
            res.end(JSON.stringify({
                error: err
            }));
        });

    }).catch(function(err) {
        res.end(JSON.stringify({
            error: err
        }));
    });
});



router.post('/update/payment', function(req, res) {
    console.log(req.session.userId);

    user.getPayments(req.session.userId, req.body.cardId).then(function(payments) {

        res.end(JSON.stringify({
            results: payments
        }));

    }).catch(function(err) {
        res.end(JSON.stringify({
            error: err
        }));
    })
})

/*
 *  Function:   Export module functions
*/
module.exports = router;
