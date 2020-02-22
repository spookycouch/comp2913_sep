var db = require('./db.js');
var md5 = require('md5');
var moment = require('moment');

/*
 *  Function:   Login User 
 *  Input:      Username, password
 *  Output:     Error Message
*/
exports.loginUser = function(email, password){

    // Md5 encryption
    password = md5(password);

    return new Promise(function(resolve, reject) {

        db.queryUser(email, password).then(function(user){

            resolve(user);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Create New User 
 *  Input:      FullName, Email, Password, Phone, Address, City, Birthday
 *  Output:     Bool / Error Message
*/
exports.registerUser = function(fullName, email, password, phone, address, city, birth){

    // Timestamp validity
    if(new Date(birth).getTime() <= 0) throw "Invalid Timestamp";

    birth = moment(new Date(birth)).format('YYYY-MM-DD HH:mm:ss');

    // Md5 encryption
    password = md5(password);

    return new Promise(function(resolve, reject) {

        db.createUser(fullName, email, password, phone, address, city, birth).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });

    });
}