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

/*
 *  Function:   Get All Activities
 *  Output:     Error Message
*/
exports.getAllActivities = function(id){

    return new Promise(function(resolve, reject) {

        db.getAllActivities().then(function(results){

            let arr = [];
            results.forEach(function(element){

                arr.push(element.id);
            });

            resolve(arr);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

/*
 *  Function:   Get All Facilities
 *  Output:     Error Message
*/
exports.getAllFacilities = function(id){

    return new Promise(function(resolve, reject) {

        db.getAllFacilities().then(function(results){

            let arr = [];
            results.forEach(function(element){

                arr.push(element.id);
            });

            resolve(arr);

        }).catch(function(err){
            
            reject(err);
        });
    });
}

/*
 *  Function:   Get All Sports
 *  Output:     Error Message
*/
exports.getAllSports = function(id){

    return new Promise(function(resolve, reject) {

        db.getAllSports().then(function(results){

            resolve(results);

        }).catch(function(err){
            
            reject(err);
        });
    });
}