var db = require('./db.js');
var md5 = require('md5');
var moment = require('moment');

/*
 *  Function:   Create New Activity
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.newActivity = function(req_body){

    // Parameters
    let name = req_body.name;
    let description = req_body.description;
    let discount = req_body.discount;
    let cost = req_body.cost;
    let date = req_body.date;
    let time = req_body.time
    let start_time = date + " " + time;
    let duration = req_body.duration;
    let id_sport = req_body.id_sport;
    let id_facility = req_body.id_facility;

    if (discount == '') // If discount is empty, set to 0 (since field is integer)
        discount = 0;
    

    return new Promise(function(resolve, reject) {

        db.createActivity(name, description, discount, cost, start_time, duration, id_sport, id_facility).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


exports.editActivity = function(req_body, activityId) {

    // Parameters
    let name = req_body.name;
    let description = req_body.description;
    let discount = req_body.discount;
    let cost = req_body.cost;
    let date = req_body.date;
    let time = req_body.time
    let start_time = date + " " + time;
    let duration = req_body.duration;
    let id_sport = req_body.id_sport;
    let id_facility = req_body.id_facility;

    if (discount == '') // If discount is empty, set to 0 (since field is integer)
        discount = 0;

    return new Promise(function(resolve, reject) {

        db.updateActivity(name, description, discount, cost, start_time, duration, id_sport, id_facility, activityId).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Create New Activity
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.newFacility = function(req_body){

    // Parameters
    let name = req_body.name;
    let description = req_body.description;
    let price = req_body.price;
    let capacity = req_body.capacity;
    let icon = req_body.icon;

    return new Promise(function(resolve, reject) {

        db.createFacility(name, description, price, capacity, icon).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}

exports.editFacility = function(req_body, facilityId) {
    // Parameters
    let name = req_body.name;
    let description = req_body.description;
    let price = req_body.price;
    let capacity = req_body.capacity;
    let icon = req_body.icon;

    return new Promise(function(resolve, reject) {

        db.updateFacility(name, description, price, capacity, icon, facilityId).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}


exports.newImage = function(ext){    

    return new Promise(function(resolve, reject) {

        db.newImage(ext).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}

exports.newActivityImage = function(activity_id, image_id){
    return new Promise(function(resolve, reject) {

        db.newActivityImage(activity_id, image_id).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}


exports.deleteActivityImage = function(activity_id, image_id) {
    return new Promise(function( resolve, reject) {

        db.deleteActivityImage(activity_id, image_id).then(function(result) {

            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}


exports.getActivityImages = function(activity_id) {
    return new Promise(function(resolve, reject) {

        db.getActivityImages(activity_id).then(function(result) {

            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}

exports.newFacilityImage = function(facility_id, image_id){
    return new Promise(function(resolve, reject) {

        db.newFacilityImage(facility_id, image_id).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}

exports.deleteFacilityImage = function(facility_id, image_id) {
    return new Promise(function( resolve, reject) {

        db.deleteFacilityImage(facility_id, image_id).then(function(result) {

            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}

exports.getFacilityImages = function(facility_id) {
    return new Promise(function( resolve, reject) {

        db.getFacilityImages(facility_id).then(function(result) {

            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}

exports.newCashPayment = function(req_body, employee_id){

    // Parameters
    let activity_id = req_body.activity_id;
    let amount = req_body.amount;
    let user_email = req_body.email;


    return new Promise(function(resolve, reject) {

        // get id by email
        db.getUserIdType(user_email).then(function(userObj) {
            db.createBooking(activity_id).then(function(result){

                db.createPaymentCash(amount, result[1][0].id, userObj.id, employee_id).then(function(result) {
    
                    resolve(result);
                }).catch(function(err) {
                    reject(err);
                })
    
            }).catch(function(err){
    
                reject(err);
            });
        }).catch(function(err) {
            reject(err);
        });
    });
}

exports.getCashPaymentReceipt = function(payment_id){
    return new Promise(function(resolve, reject) {

        db.receiptPaymentCash(payment_id).then(function(result){
            
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


exports.getEmployeePayments = function(employee_id) {
    return new Promise(function(resolve, reject) {
        db.getEmployeePayments(employee_id).then(function(result) {

            for (var i = 0; i < result.length; i++) {
                // Formatting date
                var mysql_date = result[i].purchase_date;

                let date = mysql_date.getTime();
                date = moment(date).format('DD/MM/YYYY hh:mm');
                
                result[i].purchase_date = date;
            }


            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    })
}