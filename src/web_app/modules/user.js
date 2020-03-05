var db = require('./db.js');
var md5 = require('md5');

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
 *  Function:   Get User Details
 *  Input:      Id
 *  Output:     Error Message
*/
exports.getUser = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserDetails(id).then(function(user){

            resolve(user);

        }).catch(function(err){

            reject(err);
        });
    });
}

 /*
 *  Function:   Update User Details
 *  Input:      Id
 *  Output:     Error Message
*/
exports.updateUser = function(id, full_name, email, phone, address, city, birth, profile_pic){

    return new Promise(function(resolve, reject) {

        db.changeUserDetails(id, full_name, email, phone, address, city, birth, profile_pic).then(function(result){

            resolve(result);

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