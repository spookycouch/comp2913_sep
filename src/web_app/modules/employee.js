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
    let discount = req_body.discount;
    let cost = req_body.cost;
    let start_time = req_body.start_time;
    let duration = req_body.duration;
    let id_sport = req_body.id_sport;
    

    return new Promise(function(resolve, reject) {

        db.createActivity(discount, cost, start_time, duration, id_sport).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}