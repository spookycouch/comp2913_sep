var db = require('./db.js');
var error = require('./error.js');


/*
 *  Function:   Pre-processing of Payment with check
 *  Input:      Res, Req, Webname, Activity, User {id}, Card {id}
 *  Output:     Error Message
*/
exports.processMembershipPayment = function(res, req, webname, membershipType, userId, cardId){

    return new Promise(function(resolve, reject) {

        //Please keep the methods for object-level processing.

        db.getActivityObj(activityId).then(function(activityObj){
            
            db.getUserDetails(userId).then(function(userObj){

                // Generate BookingActivity
                module.exports.generateActivityBooking(activityObj.id).then(function(bookedActivityId){
                    
                    // Generate payment
                    module.exports.generatePayment(bookedActivityId, activityObj.cost, userId, cardId).then(function(paymentId){

                        // Return successful payment id with redirect

                        console.log(paymentId);
                        resolve(paymentId);

                    // Payment failure
                    }).catch(function(err){

                        error.defaultError(req, res, webname, err);
                    });

                // Booking Failure
                }).catch(function(err){

                    error.defaultError(req, res, webname, err);
                });

            // Activity error
            }).catch(function(err){

                error.defaultError(req, res, webname, err);
            });
                                       
        }).catch(function(err){

            error.defaultError(req, res, webname, err);
        });
    });
}

/*
 *  Function:   Pre-processing of Payment with check
 *  Input:      Res, Req, Webname, Activity, User {id}, Card {id}
 *  Output:     Error Message
*/
exports.processBookingPayment = function(res, req, webname, activityId, userId, cardId){

    return new Promise(function(resolve, reject) {

        //Please keep the methods for object-level processing.

        db.getActivityObj(activityId).then(function(activityObj){
            db.getUserDetails(userId).then(function(userObj){


                // Generate BookingActivity
                module.exports.generateActivityBooking(activityObj.id).then(function(bookedActivityId){
                    
                    // Generate payment
                    module.exports.generatePayment(bookedActivityId, activityObj.cost, userId, cardId).then(function(paymentId){

                        // Return successful payment id with redirect

                        console.log(paymentId);
                        resolve(paymentId);

                    // Payment failure
                    }).catch(function(err){

                        error.defaultError(req, res, webname, err);
                    });

                // Booking Failure
                }).catch(function(err){

                    error.defaultError(req, res, webname, err);
                });

            // Activity error
            }).catch(function(err){

                error.defaultError(req, res, webname, err);
            });
                                       
        }).catch(function(err){

            error.defaultError(req, res, webname, err);
        });
    });
}

/*
 *  Function:   Generate Booking Activity Obj
 *  Input:      Activity {id}
 *  Output:     BookedActivity {id} / Error Message
*/
exports.generateActivityBooking = function(idActivity){

    return new Promise(function(resolve, reject) {

        db.generateActivityBooking(idActivity).then(function(result){

            resolve(result)

        }).catch(function(err){

            reject(err);
        })
    });
}

/*
 *  Function:   Generate Payment Obj
 *  Input:      BookedActivity {id}, Activity {cost}, User {id}, Card {id}
 *  Output:     Payment {id} / Error Message
*/
exports.generatePayment = function(bookedActivityId, activityCost, userId, cardId){

    return new Promise(function(resolve, reject) {

        db.generatePayment(bookedActivityId, activityCost, userId, cardId).then(function(result){

            resolve(result)

        }).catch(function(err){

            reject(err);
        })
    });
}



