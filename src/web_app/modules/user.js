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
exports.updateUser = function(id, name, surname, email, password, phone, address_1, address_2, zipcode, city, profile_pic){

    return new Promise(function(resolve, reject) {

        db.changeUserDetails(id, name, surname, email, password, phone, address_1, address_2, zipcode, city, profile_pic).then(function(result){

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
exports.registerUser = function(req_body){

    // Parameters
    let name = req_body.name;
    let surname = req_body.surname;
    let phone = req_body.phone;
    let address_1 = req_body.address_1;
    let address_2 = req_body.address_2;
    let zipcode = req_body.zipcode;
    let city = req_body.city;
    
    var d = req_body.birth.split("-");
    var dTimestamp = d[1] + "/" + d[2] + "/" + d[0];
    let birth = new Date(dTimestamp).getTime();
    birth = moment(birth).format('YYYY-MM-DD HH:mm:ss');

    let email = req_body.email;
    let password = req_body.password;
    let confirm_password = req_body.confirm_password;

    // Md5 encryption
    password = md5(password);
    confirm_password = md5(confirm_password);

    if(password != confirm_password) throw "Passwords not matching.";

    return new Promise(function(resolve, reject) {

        db.createUser(name, surname, email, password, phone, address_1, address_2, zipcode, city, birth).then(function(result){

            resolve(result);

        }).catch(function(err){
            
            console.log(err);

            reject(err);
        });

    });
}