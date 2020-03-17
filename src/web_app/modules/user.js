var db = require('./db.js');
var md5 = require('md5');
var moment = require('moment');

/*
 *  Function:   Check email registration
 *  Input:      Username, password
 *  Output:     Error Message
*/
exports.checkEmailRegistered = function(email){

    return new Promise(function(resolve, reject) {

        db.checkEmailRegistered(email).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}

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
 *  Function:   Update User Details
 *  Input:      Id, Name, Surname, Email, Phone from request body
 *  Output:     Error Message
*/
exports.updateDetails = function(req_body) {
    let id = req_body.id;
    let name = req_body.name;
    let surname = req_body.surname;
    let email = req_body.email;
    let phone = req_body.phone;

    return new Promise(function(resolve, reject) {
        db.updateUserDetails(id, name, surname, email, phone).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}


 /*
 *  Function:   Update User Address
 *  Input:      Id, Address_1, Address_2, Zipcode, City from request body
 *  Output:     Error Message
*/
exports.updateAddress = function(req_body) {
    let id = req_body.id;
    let address_1 = req_body.address_1;
    let address_2 = req_body.address_2;
    let zipcode = req_body.zipcode;
    let city = req_body.city;

    return new Promise(function(resolve, reject) {
        db.updateUserAddress(id, address_1, address_2, zipcode, city).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}


 /*
 *  Function:   Update User Password
 *  Input:      Id, password City from request body
 *  Output:     Error Message
*/
exports.updatePassword = function(req_body) {
    let id = req_body.id;
    let current_password = req_body.current_password;
    let password = req_body.password;
    let confirm_password = req_body.confirm_password;

    // Md5 encryption
    current_password = md5(current_password);
    password = md5(password);
    confirm_password = md5(confirm_password);
    
    if(password != confirm_password) throw "Passwords not matching.";


    return new Promise(function(resolve, reject) {
        db.updateUserPassword(id, password, current_password).then(function(result){
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

            reject(err);
        });

    });
}


/*
 *  Function:   Sets user session variable
 *  Input:      Requst Object, Email
 *  Output:     Bool / Error Message
*/
exports.setUserSession = function(req, email){

    return new Promise(function(resolve, reject) {

        db.getUserId(email).then(function(id){

            // Sets session variable
            req.session.userId = id;
            req.session.userType = 'user';

            resolve(true);

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
exports.getDetails = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserDetails(id).then(function(user){

            resolve(user);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Get User's memberships
 *  Input:      User {id}
 *  Output:     Membership / Error Message
*/
exports.getMemberships = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserMemberships(id).then(function(memberships){

            // Formatting date
            for(i = 0; i < memberships.length; i++){

                // Formatting
                var mysql_date = memberships[i].start_date;

                let date = mysql_date.getTime();
                date = moment(date).format('DD/MM/YYYY hh:mm');
                
                memberships[i].start_date = date;
            }

            resolve(memberships);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Cancel User's Membership
 *  Input:      User {id}, Membership {id}
 *  Output:     Boolean Result / Error Message
*/
exports.cancelMembership = function(userId, membershipId){

    return new Promise(function(resolve, reject) {

        db.cancelMembership(userId, membershipId).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Get User Bookings
 *  Input:      User {id}
 *  Output:     Bookings / Error Message
*/
exports.getBookings = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserBookings(id).then(function(result){

            // Formatting date
            for(i = 0; i < result.length; i++){

                // Formatting
                var mysql_date = result[i].start_time;

                let date = mysql_date.getTime();
                date = moment(date).format('DD/MM/YYYY hh:mm');
                
                result[i].start_time = date;
            }

            // Render
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Delete Booked Activity
 *  Input:      BookedActivity Id
 *  Output:     Boolean Result / Error Message
*/
exports.cancelBooking = function(id){

    return new Promise(function(resolve, reject) {

        db.cancelBooking(id).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Upcoming activities
 *  Input:      No Items, Page No
 *  Output:     Error Message
*/
exports.upcomingActivities = function(no_items, page_no){

    return new Promise(function(resolve, reject) {

        db.getUpcomingActivities(no_items, page_no).then(function(result){
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Upcoming activities
 *  Input:      No Items, Page No
 *  Output:     Error Message
*/
exports.facilities = function(no_items, page_no){

    return new Promise(function(resolve, reject) {

        db.getFacilities(no_items, page_no).then(function(result){
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Upcoming activities
 *  Input:      No Items, Page No
 *  Output:     Error Message
*/
exports.facilities_discover = function(id){

    return new Promise(function(resolve, reject) {

        db.getFacility(id).then(function(results){
            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}