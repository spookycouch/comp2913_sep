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
            db.getBookedCapacity(activityId).then(function(bookedCapacity) {

                if (bookedCapacity.capacity >= activityObj.capacity) {
                    return reject("This activity is fully booked");
                }

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

            // Booked Capacity error
            }).catch(function(err) {
                reject(err);
            });
            
        // Activity Error
        }).catch(function(err){

            reject(err);
        });
    });
}


exports.processBookingPaymentFree = function(activityId, userId) {
    return new Promise(function(resolve, reject) {
        db.getActivityObj(activityId).then(function(activityObj) {

            module.exports.generateActivityBooking(activityObj.id).then(function(bookedActivityId) {
                
                // Generate payment // card 2 is free payments
                module.exports.generateBookingPayment(bookedActivityId, 0, userId, 2).then(function(paymentId){

                    // Successful payment
                    resolve(paymentId);

                // Payment failure
                }).catch(function(err){

                    reject(err);
                });

            }).catch(function(err) {
                reject(err);
            });
     
        }).catch(function(err) {
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



exports.getBookingMembership = function(userId, activityObj) {
    return new Promise(function(resolve, reject) {

        user.getMemberships(userId).then(function(memberships) {

            if (memberships.length > 0) {
                for (var i = 0; i < memberships.length; i++) {
                    if (!memberships[i].expired) {              // if the membership is not expired
                        if (memberships[i].type == 3) {         // if they have a sports pass always return true
                            
                            resolve(true)
                        
                        } else if (memberships[i].type < 3) { 
                            if (memberships[i].id_sport == activityObj.id_sport) { // if their membership is for the same sport, return true
                                
                                resolve(true);
                            }
                        }
                    }
                }
            }   

            resolve(false);

        }).catch(function(err) {
            reject(err);
        })

    });
}


