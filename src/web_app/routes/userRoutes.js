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
                if (req.session.userType > 2) { // If they're a manager redirect to manager overview
                    res.redirect('/manager/overview');
                } else {
                    res.redirect('/user/account');
                }

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
    
    if (req.session.userId == undefined)
        res.redirect('/home');

    if (req.session.userType > 2)
        res.redirect('/manager/overview');
    
    else {

        // Get user details
        user.getDetails(req.session.userId).then(function(result) {
            
            res.render(path.join(__dirname + '/../views/pages/account/account.ejs'),
            {
                title: webname + "| Account",
                session: req.session,
                user: result
            });

        }).catch(function(err) {

            error.loginErrorPage(req, res, webname);
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
});

/*
 *  Function:   Account Bookings Page Router
*/
router.get('/account/bookings', function(req, res) {
    
    // Session Check
    if (req.session.userId == undefined)
        res.redirect('/home');

    // Success
    else {

        // Get details
        user.getDetails(req.session.userId).then(function(usr) {

            user.getBookings(req.session.userId).then(function(bookings){

                // Render details
                res.render(path.join(__dirname + '/../views/pages/account/account-bookings.ejs'),
                {
                    title: webname + "| Account | Bookings",
                    session: req.session,
                    bookings: bookings,
                    user: usr,
                    csrfToken: req.csrfToken()
                });

            // Error catching
            }).catch(function(err){
                
                error.defaultError(req, res, webname, err);
            });
                
        }).catch(function(err) {
            
            error.defaultError(req, res, webname, err);
        });
    }
});



/*
 *  Function:   Login Details Page Router
*/
router.get('/account/details', function(req, res) {
    
    // Session check
    if (req.session.userId == undefined)
        res.redirect('/home');
    
    // Success
    else {

        // Get data
        user.getDetails(req.session.userId).then(function(userObj) {

            // Render data
            res.render(path.join(__dirname + '/../views/pages/account/account-details.ejs'),
            {
                title: webname + "| Account | Details",
                session: req.session,
                user: userObj,
                csrfToken: req.csrfToken()
            });
            
        // Error -> logout
        }).catch(function(err) {
            
            error.defaultError(req, res, webname, err);
        });
    }
});


/*
 *  Function:   Login Details Update Details
*/
router.post('/account/update/details', function(req, res) {
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {
        try {
            id = req.body.id; // Put ID in temporary var
            delete req.body.id; // Delete ID from object so it is not validated
            const value = validation.updateDetailsValidation(req.body);
            req.body.id = id // Add ID back into object

            if(value.error != undefined)
                throw value.error.details;

            user.updateDetails(req.body).then(function(result) {
                error.updateErrorPage(req, res, webname, user, [{
                    message: 'Details Updated Successfully',
                    path: 'success'
                }]);
    
            }).catch(function(err) {
                error.updateErrorPage(req, res, webname, user, [{
                    message: err,
                    path: 'unsuccessful'
                }]);
            })

        } catch(err) {
            error.updateErrorPage(req, res, webname, user, err);
        }
    }
})


/*
 *  Function:   Login Details Update Address
*/
router.post('/account/update/address', function(req, res) {
    
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        // Validate the data
        try {
            id = req.body.id; // Put ID in temporary var
            delete req.body.id; // Delete ID from object so it is not validated
            const value = validation.updateAddressValidation(req.body);
            req.body.id = id // Add ID back into object

            if(value.error != undefined)
                throw value.error.details;


            user.updateAddress(req.body).then(function(result) {
                error.updateErrorPage(req, res, webname, user, [{
                    message: 'Address Updated Successfully',
                    path: 'success'
                }]);
    
            }).catch(function(err) {
                error.updateErrorPage(req, res, webname, user, [{
                    message: err,
                    path: 'unsuccessful'
                }]);
            });

        // If an error with the data
        } catch(err) {
            error.updateErrorPage(req, res, webname, user, err);
        }
    }
});

/*
 *  Function:   Update Account Password
*/
router.post('/account/update/password', function(req, res) {
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {
        try {
            id = req.body.id; // Put ID in temporary var
            delete req.body.id; // Delete ID from object so it is not validated
            const value = validation.updatePasswordValidation(req.body);
            req.body.id = id // Add ID back into object

            if(value.error != undefined)
                throw value.error.details;

            user.updatePassword(req.body).then(function(result) {
                error.updateErrorPage(req, res, webname, user, [{
                    message: 'Password Updated Successfully',
                    path: 'success'
                }]);
    
            }).catch(function(err) {    
                error.updateErrorPage(req, res, webname, user, [{
                    message: err,
                    path: 'current_password'
                }]);
            });

        } catch(err) {
            error.updateErrorPage(req, res, webname, user, err);
        }
    }
});


/*
 *  Function:   Account Memberships Page Router
*/
router.get('/account/memberships', function(req, res) {
    
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        // Get memberships
        user.getMemberships(req.session.userId).then(function(memberships) {

            // Get user details
            user.getDetails(req.session.userId).then(function(result) {

                // Render
                res.render(path.join(__dirname + '/../views/pages/account/account-memberships.ejs'),
                {
                    title: webname + "| Account | Memberships",
                    session: req.session,
                    memberships: memberships,
                    user: result,
                    csrfToken: req.csrfToken()
                });

            }).catch(function(err) {
                
                error.defaultError(req, res, webname, err);
            });

        }).catch(function(err) {

            error.defaultError(req, res, webname, err);
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
        
        // User details
        user.getDetails(req.session.userId).then(function(result) {

            // Cards
            user.getCards(req.session.userId).then(function(cards){

                // Render
                res.render(path.join(__dirname + '/../views/pages/account/account-payment-details.ejs'),
                {
                    title: webname + "| Account | Payment",
                    session: req.session,
                    user: result,
                    cards: cards,
                    csrfToken: req.csrfToken()
                });

            }).catch(function(err){
                
                error.defaultError(req, res, webname, err);
            });
            
        }).catch(function(err) {
            
            error.defaultError(req, res, webname, err);
        });
        
    }
});

/*
 *  Function:   Update Account Password
*/
router.post('/account/add/card', function(req, res) {
    
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        try {

            // Validation
            const value = validation.newCardValidation(req.body);

            if(value.error != undefined)
                throw value.error.details;

            // Query
            user.addCard(req.session.userId, req.body).then(function(result) {
                
                // Success
                res.redirect("/user/account/payment");

            }).catch(function(err) {    
                
                /*
                    PLS Frontend complete this

                error.cardPaymentErrorPage(req, res, webname, user, [{
                    message: err,
                    path: 'current_password'
                }]);
                */
            });

        } catch(err) {
            
            /*
                    PLS Frontend complete this

                error.cardPaymentErrorPage(req, res, webname, user, [{
                    message: err,
                    path: 'current_password'
                }]);
                */
        }
    }
});


module.exports = router;