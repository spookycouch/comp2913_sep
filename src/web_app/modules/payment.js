var db = require('./db.js');
var user = require('./user.js');

/*
 *  Function:   Pre-processing of Payment with check
 *  Input:      Res, Req, Webname, Activity, User {id}, Card {id}
 *  Output:     Error Message
*/
exports.processMembershipPayment = function(pricingId, userId, cardId){

    return new Promise(function(resolve, reject) {

        // Get cost
        db.getPricingAmount(pricingId).then(function(pricingCost){

            //Please keep the methods for object-level processing. 
            db.getUserDetails(userId).then(function(userObj){

                // Generate Membership
                db.createMembership(userId, pricingId).then(function(membershipId){

                    // Generate payment
                    module.exports.generateMembershipPayment(membershipId, pricingCost, userId, cardId).then(function(paymentId){

                        // Return successful payment id with redirect
                        resolve(paymentId);

                    // Payment failure
                    }).catch(function(err){

                        reject(err);
                    });

                // Membership error
                }).catch(function(err){
                    
                    reject(err);
                });

            // User details error
            }).catch(function(err){

                reject(err);
            });

        // Pricing error
        }).catch(function(err){
        
            reject(err);
        });
    });
}

/*
 *  Function:   Pre-processing of Payment with check
 *  Input:      Res, Req, Webname, Activity, User {id}, Card {id}
 *  Output:     Error Message
*/
exports.processBookingPayment = function(activityId, userId, cardId){

    return new Promise(function(resolve, reject) {

        // Get Activity details
        db.getActivityObj(activityId).then(function(activityObj){

            // Get user Details
            db.getUserDetails(userId).then(function(userObj){

                // Generate BookingActivity
                module.exports.generateActivityBooking(activityObj.id).then(function(bookedActivityId){
                    
                    // Generate payment
                    module.exports.generateBookingPayment(bookedActivityId, activityObj.cost, userId, cardId).then(function(paymentId){

                        // Successful payment
                        resolve(paymentId);

                    // Payment failure
                    }).catch(function(err){

                        reject(err);
                    });

                // Booking Failure
                }).catch(function(err){

                    reject(err);
                });

            // Activity error
            }).catch(function(err){

                reject(err);
            });
                                       
        }).catch(function(err){

            reject(err);
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
 *  Function:   Generate Booking Payment Obj
 *  Input:      BookedActivity {id}, Activity {cost}, User {id}, Card {id}
 *  Output:     Payment {id} / Error Message
*/
exports.generateBookingPayment = function(bookedActivityId, activityCost, userId, cardId){

    return new Promise(function(resolve, reject) {

        db.generateBookingPayment(bookedActivityId, activityCost, userId, cardId).then(function(result){

            resolve(result)

        }).catch(function(err){

            reject(err);
        })
    });
}

/*
 *  Function:   Generate Booking Payment Obj
 *  Input:      Membership {id}, Pricing {amount}, User {id}, Card {id}
 *  Output:     Payment {id} / Error Message
*/
exports.generateMembershipPayment = function(membershipId, cost, userId, cardId){

    return new Promise(function(resolve, reject) {

        
        db.generateMembershipPayment(membershipId, cost, userId, cardId).then(function(result){

            resolve(result)

        }).catch(function(err){

            reject(err);
        })
    });
}



