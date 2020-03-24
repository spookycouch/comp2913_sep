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

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csurf({ cookie: true }));

var csrf = csurf({ cookie: true });

// Website header
const webname = ' The Edgy ';



router.get('/register/employee', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin
        res.redirect('/user/logout');

    else {
        user.getDetails(req.session.userId).then(function(result) {
            res.render(path.join(__dirname + '/../views/pages/manager/employee_new.ejs'), {
                title: webname + "| Register | Employee",
                session: req.session,
                csrfToken: req.csrfToken(),
                form: req.body,
                user: result
            });
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout'); 
        });
        
    }
});


router.post('/register/employee', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin
        res.redirect('/user/logout');

    else {  
        try {
            const value = validation.registerValidation(req.body);   

            // Error
            if(value.error != undefined)
                throw value.error.details;

            user.registerUser(req.body).then(function(result) {
                error.registerEmployeeErrorPage(req, res, webname, user, [{
                    message: "Employee Created successfully",
                    path: 'successful'
                }]);
        
            }).catch(function(err) {
                error.registerEmployeeErrorPage(req, res, webname, user, [{
                    message: err,
                    path: 'unsuccessful'
                }]);
            });   
        } catch(err) {
            error.registerEmployeeErrorPage(req, res, webname, user, err);
        }
    }
});


router.get('/statistics', function(req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin
        res.redirect('/user/logout');

    else {
        user.getDetails(req.session.userId).then(function(result) {
            res.render(path.join(__dirname + '/../views/pages/manager/statistics.ejs'), {
                title: webname + "| Statistics",
                session: req.session,
                csrfToken: req.csrfToken(),
                user: result
            });

        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');  
        });
    }


    
});


/*
 * Function:    Manager overview page
*/
router.get('/overview', function(req, res) { 
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin
        res.redirect('/user/logout');

    else {
        user.getDetails(req.session.userId).then(function(result) {
            res.render(path.join(__dirname + '/../views/pages/manager/account_manager.ejs'), {
                title: webname + "| Manager | Overview",
                session: req.session,
                user: result
            });

        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout'); 
        });
    }
        

    
});


/*
 * Function:    Test new activity
*/
router.get('/activities/new', function (req, res) {   
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin
        res.redirect('/home');

    else {
        user.getDetails(req.session.userId).then(function(result) {

            user.allFacilities().then(function(facilities) {

                return res.render(path.join(__dirname + '/../views/pages/manager/activities_new.ejs'), {
                    title: webname + "| Activities | New",
                    session: req.session,
                    csrfToken: req.csrfToken(),
                    user: result,
                    facilities: facilities
                });
            }).catch(function(err) {
                console.log(err);
                res.redirect('/user/logout');
            });

            
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');
        });
    }

    
})


/*
 * Function:    Test new facility
*/
router.get('/facilities/new', function (req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // if not an admin
        res.redirect('/home');

    else {

        icons = ['basketball', 'gym', 'running', 'sport', 'swim', 'tennis'];

        user.getDetails(req.session.userId).then(function(result) {
            return res.render(path.join(__dirname + '/../views/pages/manager/facilities_new.ejs'), {
                title: webname + "| Facilities | New",
                session: req.session,
                csrfToken: req.csrfToken(),
                user: result,
                icons: icons
            });

        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');
        });    
    }
})



module.exports = router;