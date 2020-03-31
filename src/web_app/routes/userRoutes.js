const express = require('express');
const validation = require('../modules/validation');
const PDFDocument = require('pdfkit');
const jwt = require('jsonwebtoken');
var path = require('path');
const router = express.Router();
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var facility = require('../modules/facility');
var error = require('../modules/error');
var employee = require('../modules/employee');


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

        console.log(req.body);

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
    var nextPage = req.session.from;
    req.session.destroy();

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
                if (nextPage != undefined) {
                    res.redirect(nextPage);
                } else if (req.session.userType > 2) { // If they're a manager redirect to manager overview
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
                    path: 'unsuccessful-details'
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
                    path: 'unsuccessful-address'
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
                    form: req.body,
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
                req.body = {} // Clear request body so data isnt showed on reload

                error.cardPaymentErrorPage(req, res, webname, user, [{
                    message: "Payment Method Added Successfully",
                    path: "success"
                }]);

            }).catch(function(err) {    
                console.log(err);
                error.cardPaymentErrorPage(req, res, webname, user, [{
                    message: err,
                    path: 'unsuccessful'
                }])
            });

        } catch(err) {            
            error.cardPaymentErrorPage(req, res, webname, user, err);
        }
    }
});



/*
 * Function:    new cash payment
*/
router.get('/account/payment/cash', function (req, res) {   
    if(req.session.userId == undefined || req.session.userType != 2) // If not an employee
        res.redirect('/home');

    else {
        user.getDetails(req.session.userId).then(function(result) {
            facility.getAllActivities().then(function(activities) {
                return res.render(path.join(__dirname + '/../views/pages/account/account-cash-payment.ejs'), {
                    title: webname + "| Account | Payments | Cash",
                    session: req.session,
                    csrfToken: req.csrfToken(),
                    user: result,
                    activities: activities
                });
            }).catch(function(err) {
                console.log(err); // for debugging
                res.redirect('/user/logout');
            })
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');
        });
    }
})


/*
 *  Function:   Cash Payment POST
*/
router.post('/account/payment/cash', function(req, res) {
    if(req.session.userId == undefined || req.session.userType != 2) // If not an employee
        res.redirect('/user/logout');

    else {  
        try {
            const value = validation.cashPaymentValidation(req.body);

            // Error
            if (value.error != undefined)
                throw value.error.details;

            employee.newCashPayment(req.body, req.session.userId).then (function (result){
                error.cashPaymentError(req, res, webname, user, facility, [{
                    message: "Cash Payment Booking created successfully",
                    path: 'success',
                    payment_id: result[1][0].id
                }]);
            
            }).catch(function(err) {
                error.cashPaymentError(req, res, webname, user, facility, [{
                    message: err,
                    path: 'unsuccessful'
                }])
            });

        // Catch all other errors thrown
        } catch(err) {
            error.cashPaymentError(req, res, webname, user, facility, err)
        }
    }
});


/*
 *  Function:   Cash Payment Receipt GET
*/
router.get('/account/payment/cash/receipt', function(req, res) {
    if(req.session.userId == undefined || req.session.userType != 2) // If not an employee
        res.redirect('/user/logout');

    else {  
        try {
            // TODO: validation

            employee.getCashPaymentReceipt(req.query.payment_id).then (function (result){
                console.log(result);
                var doc = new PDFDocument({size: [400, 600]});
                doc.font('Courier');
                
                doc.text('THE EDGY GYM', {align: 'center'});
                doc.text('Woodhouse', {align: 'center'});
                doc.text('Leeds LS2 9JT', {align: 'center'});

                doc.text('\n\n');

                // date
                var date = new Date(result.purchase_date);
                console.log(date);
                var date_string =   date.getDate().toString().padStart(2, '0') + '/' +
                                    (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
                                    date.getFullYear().toString().padStart(4, '0')

                var time_string =   date.getHours().toString().padStart(2, '0') + ':' +
                                    date.getMinutes().toString().padStart(2, '0') + ':' +
                                    date.getSeconds().toString().padStart(2, '0');
                var curr_y = doc.y
                doc.text(date_string, doc.x, curr_y, {align: 'left'});
                doc.text(time_string, doc.x, curr_y, {align: 'right'});
                doc.text('\n');

                doc.text('\n');
                doc.text('Payment no:   ' + result.id);
                doc.text('Served by:    ' + result.employee_name);
                doc.text('Employee ID:  ' + result.employee_id);
                
                doc.text('\n\n');

                doc.text('Booking ID: ' + result.booking_id);
                doc.text('Activity ID ' + result.activity_id + ': ' + result.name);

                // break
                doc.text('\n\n');
                doc.text('===================================', {align: 'center'})

                // monies count
                var curr_y = doc.y
                doc.text('total:', doc.x, curr_y, {align: 'left'});
                doc.text(result.cost.toFixed(2), doc.x, curr_y, {align: 'right'});
                doc.text('\n');
                curr_y = doc.y
                doc.text('paid:', doc.x, curr_y, {align: 'left'});
                doc.text(result.amount.toFixed(2), doc.x, curr_y, {align: 'right'});
                doc.text('\n');
                curr_y = doc.y
                doc.text('change:', doc.x, curr_y, {align: 'left'});
                doc.text((result.amount - result.cost).toFixed(2), doc.x, curr_y, {align: 'right'});


                // pipe the doc to response and end write
                doc.pipe(res);
                doc.end();
            
            }).catch(function(err) {
                
                // TODO: proper error handle
                console.log(err);
            });

        // Catch all other errors thrown
        } catch(err) {

            // TODO: proper error handle
            console.log(err);
        }
    }
});









module.exports = router;