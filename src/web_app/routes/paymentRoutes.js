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
var payment = require('../modules/payment');
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

    activityId = req.params['id'];

    if (req.session.userId == undefined) {
        req.session.from = "/payment/" + req.url;
        res.redirect('/user/login');
    } else {
        if (req.session.userType > 2) { // Managers shouldnt be able to book things
            res.redirect('/home');
        } else {

            user.getActivity(activityId).then(function(activity) {

                user.getActivityBookedCapacity(activityId).then(function(bookedCapacity) {

                    if (bookedCapacity.capacity >= activity.capacity)
                        res.redirect('/activities?full=' + activity.id);

                    else {
                        payment.getBookingPrice(req.session.userId, activity).then(function(cost) {

                            activity.cost = cost;

                            // they have the correct membership so get the booking for free
                            if (activity.cost == 0) { 

                                payment.processBookingPaymentFree(activity.id, req.session.userId, 2).then(function(paymentId) {
        
                                    console.log("Booking id received, payment free: " + paymentId);
                                    res.redirect("/user/account/bookings");
        
                                }).catch(function(err) {
                                    error.defaultError(req, res, webname, err);
        
                                }); 
        
                            // They dont have the correct membership so have to pay for the booking
                            } else {          
        
                                // User details
                                user.getDetails(req.session.userId).then(function(userDetails) {
        
                                    // Cards
                                    user.getCards(req.session.userId).then(function(cards){
                                        var cardId = 0;
                                        if (cards.length > 0) cardId = cards[0].id;
        
                                        // Render
                                        res.render(path.join(__dirname + '/../views/pages/payment/payment-booking.ejs'),
                                        {
                                            title: webname + "| Payment | Membership",
                                            session: req.session,
                                            activity: activity,
                                            pricing: activity.cost,
                                            user: userDetails,
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
        
                        }).catch(function(err) {
                            error.defaultError(req, res, webname, err);
                        });
                    }

                }).catch(function(err) {
                    error.defaultError(req, res, webname, err);
                });

            }).catch(function(err) {
                error.defaultError(req, res, webname, err);            
            });
        }
    }
});


/*
 *  Function:   Membership payment page
*/
router.get('/membership/:id*', function(req, res) {

    var type = req.params['id']

    // If user not logged in -> store url intent -> redirect login
    if (req.session.userId == undefined) {
        
        req.session.from = "/payment/" + req.url;
        res.redirect('/user/login');

    // Else render payment page
    } else {
        facility.getPricingByType(type).then(function(pricing) {

            if (type == 2) {
                facility.getMonthlyPricing().then(function(monthly) {

                    for(var i = 0; i < pricing.length; i++) {
                        for (var j = 0; j < monthly.length; j++) {
                            if (monthly[j].id_sport == pricing[i].id_sport) {
                                pricing[i].savings = ((monthly[j].amount * 12) - pricing[i].amount).toFixed(2);

                            }
                        }
                    }

                }).catch(function(err) {
                    error.defaultError(req, res, webname, err);
                });
            }

            // User details
            user.getDetails(req.session.userId).then(function(userDetails) {

                // Cards
                user.getCards(req.session.userId).then(function(cards){
                    var cardId = 0;
                    if (cards.length > 0) cardId = cards[0].id;

                    // Render
                    res.render(path.join(__dirname + '/../views/pages/payment/payment-membership.ejs'),
                    {
                        title: webname + "| Payment | Membership",
                        session: req.session,
                        user: userDetails,
                        cards: cards,
                        form: req.body,
                        pricing: pricing,
                        type: type,
                        csrfToken: req.csrfToken()
                    });


                }).catch(function(err){

                    error.defaultError(req, res, webname, err);
                });   

            }).catch(function(err) {
                error.defaultError(req, res, webname, err);
                
            });
        }).catch(function(err) {
            error.defaultError(req, res, webname, err);
            
        });
    }
});


module.exports = router;
