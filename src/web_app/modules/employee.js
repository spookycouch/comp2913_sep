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
    let icon = req_body.icon;

    return new Promise(function(resolve, reject) {

        db.createFacility(name, description, price, icon).then(function(result){

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

exports.newFacilityImage = function(facility_id, image_id){
    return new Promise(function(resolve, reject) {

        db.newFacilityImage(facility_id, image_id).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}

exports.newCashPayment = function(req_body, employee_id){

    // Parameters
    let activity_id = req_body.activity_id;
    let amount = req_body.amount;
    let email = req_body.email;

    return new Promise(function(resolve, reject) {

        db.createBooking(activity_id).then(function(result){

            db.createPaymentCash(amount, result[1][0].id, email).then(function(result) {

                resolve(result);
            });

        }).catch(function(err){

            reject(err);
        });

    });
}