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

// Website header
const webname = ' The Edgy ';

/*
 *  Function:   Register Backend Query
*/
router.post('/register', function(req, res) {

    // Data validation
    try {
        
        const value = validation.registerValidation(req.body);   

        // Error
        if(value.error != undefined)
            throw value.error.details;

        // Query
        user.registerUser(req.body).then(function(result){

            let email = req.body.email;

            // Success
            user.setUserSession(req, email).then(function(result){

                // Redirect
                res.redirect('/user/account');

            // Error
            }).catch(function(err){

                error.loginErrorPage(req, res, webname, [{
                    message: err,
                    path: 'unsuccessful'
                }]);
            });

        // Error
        }). catch(function(err){

            error.loginErrorPage(req, res, webname, [{
                message: err,
                path: 'unsuccessful'
            }]);
        });

    // Error
    } catch(err) {

        error.loginErrorPage(req, res, webname, err);
    }
});


/*
 *  Function:   Login Backend Query
*/
router.post('/login', function(req, res) {

    try { 

        // Validation
        const value = validation.loginValidation(req.body);
        
        if(value.error != undefined) {
            throw value.error.details;
        }

        // Data
        let email = req.body.email;
        let password = req.body.password;

        // Query
        user.loginUser(email, password).then(function(result){

            // Set session logged user
            user.setUserSession(req, email).then(function(result){

                // Success!
                res.redirect('/user/account');

            // Error
            }).catch(function(err){

                error.loginErrorPage(req, res, webname, [{
                    message: err,
                    path: 'unsuccessful'
                }]);

            });

        // Error
        }). catch(function(err){

            error.loginErrorPage(req, res, webname, [{
                message: err,
                path: 'unsuccessful'
            }]);
        });


    } catch(err) {

        error.loginErrorPage(req, res, webname, err);
    }
});

/*
 *  Function:   Account Page
*/
router.get('/account', function(req, res) {
    
    if(req.session.userId == undefined)
        res.redirect('/home');
    
    else {

        user.getDetails(req.session.userId).then(function(result) {
            res.render(path.join(__dirname + '/../views/pages/account/account.ejs'),
            {
                title: webname + "| Account",
                session: req.session,
                user: result
            });
        }).catch(function(err) {
            res.redirect('/logout');
        });

        
    }
});


/*
 *  Function:   Logout Redirect
*/
router.get('/logout', function(req, res) {
    
    // Deleting session
    delete req.session.userId;

    // -> Homepage
    res.redirect('/');
    console.log("successfully logged out");
});


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
 *  Function:   Account Bookings Page Router
*/
router.get('/account/bookings', function(req, res) {
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {
        user.getBookings(req.session.userId).then(function(bookings) {

            user.getDetails(req.session.userId).then(function(result) {
                // Preprocess here
                console.log(bookings);

                res.render(path.join(__dirname + '/../views/pages/account/account-bookings.ejs'),
                {
                    title: webname + "| Account | Bookings",
                    session: req.session,
                    bookings: bookings,
                    user: result
                });
            }).catch(function(err) {
                console.log(err);
                res.redirect('/logout');
            });
        }).catch(function(err) {

            console.log(err);
            res.redirect('/logout');
        });
        
    }
});


/*
 *  Function:   Login Details Page Router
*/
router.get('/account/details', function(req, res) {
    
    if (req.session.userId == undefined)
        res.redirect('/home');
    
    else {
        user.getDetails(req.session.userId).then(function(userObj) {

            // Preprocess User here
            console.log(userObj);

            res.render(path.join(__dirname + '/../views/pages/account/account-details.ejs'),
            {
                title: webname + "| Account | Details",
                session: req.session,
                user: userObj
            });
            
        // Error -> logout
        }).catch(function(err) {
            
            res.redirect('/user/logout');
        });
    }
});


/*
 *  Function:   Account Memberships Page Router
*/
router.get('/account/memberships', function(req, res) {
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {
        user.getMemberships(req.session.userId).then(function(memberships) {
            user.getDetails(req.session.userId).then(function(result) {

                res.render(path.join(__dirname + '/../views/pages/account/account-memberships.ejs'),
                {
                    title: webname + "| Account | Memberships",
                    session: req.session,
                    memberships: memberships,
                    user: result
                });
            }).catch(function(err) {
                console.log(err);
                res.redirect('/logout');
            });

            // Preprocess here
            

        }).catch(function(err) {

            console.log(err);
            res.redirect('/logout');
        });
        
    }
});


/*
 *  Function:   Account Payment Page Router
*/
router.get('/account/payment', function(req, res) {
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {
        user.getDetails(req.session.userId).then(function(result) {
            res.render(path.join(__dirname + '/../views/pages/account/account-payment-details.ejs'),
            {
                title: webname + "| Account | Payment",
                session: req.session,
                user: result
            });

        }).catch(function(err) {
            res.redirect('/logout');
        });
        
    }
});


module.exports = router;