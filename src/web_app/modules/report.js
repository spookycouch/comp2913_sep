var db = require('./db.js');

/*
 *  Function:   Login Activity
 *  Output:     Error Message
*/
exports.getLoginActivity = function(){

    return new Promise(function(resolve, reject) {

        db.getUserLoginActivity().then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Login Activity
 *  Output:     Error Message
*/
exports.getRegistrationActivity = function(){

    return new Promise(function(resolve, reject) {

        db.getUserRegistrationActivity().then(function(results){

            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}