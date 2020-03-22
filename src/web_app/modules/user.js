var db = require('./db.js');
var md5 = require('md5');
var moment = require('moment');
var QRCode = require('qrcode')


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
    let userType = req_body.type;


    // Md5 encryption
    password = md5(password);
    confirm_password = md5(confirm_password);

    if(password != confirm_password) throw "Passwords not matching.";

    return new Promise(function(resolve, reject) {

        db.createUser(name, surname, email, password, userType, phone, address_1, address_2, zipcode, city, birth).then(function(result){

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

        db.getUserIdType(email).then(function(user){

            // Sets session variable
            req.session.userId = user.id;
            req.session.userType = user.type;

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

                var now = moment();

                let date = mysql_date.getTime();
                dateStr = moment(date).format('DD/MM/YYYY hh:mm');
                
                // Validity check
                memberships[i].start_date = dateStr;
                memberships[i].expired = (moment(date).add(memberships[i].validity, 'days').diff(now, 'days') < 0);
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
 *  Function:   Cancel User's Credit Card
 *  Input:      User {id}, Membership {id}
 *  Output:     Boolean Result / Error Message
*/
exports.deleteCard = function(userId, cardId){

    return new Promise(function(resolve, reject) {

        db.deleteUserCard(userId, cardId).then(function(result){

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

        db.getUserBookings(id).then(async function(result){

            // Formatting date and set QR code
            for(var i = 0; i < result.length; i++){

                // Formatting date
                var mysql_date = result[i].start_time;

                let date = mysql_date.getTime();
                date = moment(date).format('DD/MM/YYYY hh:mm');
                
                result[i].start_time = date;
                
                // Set QR code
                await QRCode.toDataURL(result[i].id.toString()).then(function(url,err) {
                    result[i].qr = url;
                });
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

/*
 *  Function:   Timetable for facilities, week of given date
 *  Input:      Facility id, date
 *  Output:     Error Message
*/
exports.facilities_timetable = function(facilityId, date){
    return new Promise(function(resolve, reject) {
        db.getFacilityTimetable(facilityId, date.getDate()).then(function(result) {
            // We want to convert the start time to format of just time (HH:MM:SS), ready for being rendered
            for (var i = 0; i < result.length; i++) {
                result[i].start_time = (result[i].start_time).toTimeString().split(' ')[0];
            }

            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


exports.activitiesTimetable = function(date) {
    return new Promise(function(resolve, reject) {
        db.getActivitiesTimetable(date.getDate()).then(function(result) {
            // We want to convert the start time to format of just time (HH:MM:SS), ready for being rendered
            for (var i = 0; i < result.length; i++) {
                result[i].start_time = (result[i].start_time).toTimeString().split(' ')[0];
            }

            resolve(result);
        }).catch(function(err) {

            reject(err);
        });
    });
}

/*
 *  Function:   Get User Cards
 *  Input:      User Id
 *  Output:     Error Message
*/
exports.getCards = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserCards(id).then(function(cards){
            
            // Preprocess cards for security reasons
            for(x = 0; x < cards.length; x++){
                
                cards[x].number = cards[x].number.replace(cards[x].number.substring(0,15), "****************");
                cards[x].expire_date = cards[x].expire_date.replace(cards[x].expire_date.substring(0,2), "**");
            }

            resolve(cards);

        }).catch(function(err){

            reject(err);
        });
    });
}

/*
 *  Function:   Add new User Card
 *  Input:      User Id, Request Body
 *  Output:     Error Message
*/
exports.addCard = function(userId, req_body){

    return new Promise(function(resolve, reject) {

        db.createUserCard(userId, req_body).then(function(result){
            
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}