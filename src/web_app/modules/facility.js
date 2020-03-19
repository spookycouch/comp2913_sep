var db = require('./db.js');

/*
 *  Function:   Get Facility Activities
 *  Output:     Error Message
*/
exports.getFacilityActivities = function(id){

    return new Promise(function(resolve, reject) {

        db.getFacilityActivities(id).then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}
