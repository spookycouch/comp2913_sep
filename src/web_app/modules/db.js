var mysql = require('mysql');
var SqlString = require('sqlstring');

let host = "127.0.0.1"
let db = "comp2913_sep"
let user = "web_comp2913"
let psw = ""
let port = 3306



function getConnection() {
    return mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });
}

/*
 *  Function:   Check for email registration existance
 *  Input:      Email
 *  Output:     Bool / Error Message
*/
exports.checkEmailRegistered = function(email) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM User WHERE email = ?',
                    [email]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                if (results.length > 0)
                    resolve(results);

                else
                    resolve(false);
            });
        });
    });
}

/*
 *  Function:   Query User by email
 *  Input:      Email, password
 *  Output:     User Object / Error Message
*/
exports.queryUser = function(email, password) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM User WHERE email = ? AND password = ?',
                    [email, password]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                if (results.length > 0){

                    // Loggin user activity
                    module.exports.logUserLogin(results[0].id).then(function(result){

                        // Success
                        resolve(results[0]);

                    }).catch(function(err){

                        reject(err);
                    });
                }
                else
                    reject("Email or Password Incorrect.");
            });
        });
    });
}

/*
 *  Function:   Query User id by email
 *  Input:      Email
 *  Output:     Id / Error Message
*/
exports.getUserIdType = function(email) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT id, type FROM User WHERE email = ?',
                    [email]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                if (results.length > 0)
                    resolve(results[0]);

                else
                    reject("User not found.");

            });
        });
    });
}

/*
 *  Function:   Query User by id once logged in
 *  Input:      Id
 *  Output:     User Object / Error Message
*/
exports.getUserDetails = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT id, name, surname, email, birth, phone, address_1, address_2, city, zipcode, profile_pic FROM User WHERE id = ?',
                    [id]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                if (results.length > 0)
                    resolve(results[0]);

                else
                    reject("User not found.");

            });
        });
    });
}


/*
 *  Function:   Change user details
 *  Input:      Id, Name, Surname, Email, Password, Phone, Address 1, Address 2, Zipcode, City, Profile Pic
 *  Output:     User Object / Error Message
*/
exports.updateUserDetails = function(id, name, surname, email, phone) { //TODO: include Profile picture when updating

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'UPDATE User SET name = ?, surname = ?, email = ?, phone = ? WHERE id = ?',
                    [name, surname, email, phone, id]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                else
                    resolve(true);

            });
        });
    });
}


exports.updateUserAddress = function(id, address_1, address_2, zipcode, city) { 
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'UPDATE User SET address_1 = ?, address_2 = ?, zipcode = ?, city = ? WHERE id = ?',
                    [address_1, address_2, zipcode, city, id]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                else
                    resolve(true);
            });
        });
    });
}


exports.updateUserPassword = function(id, password, current_password) { 
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'UPDATE User SET password = ? WHERE id = ? and password = ?',
                    [password, id, current_password]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                if (results.changedRows > 0)
                    resolve(true);

                else
                    reject("Password Incorrect.");
            });
        });
    });
}



/*
 *  Function:   Create New User
 *  Input:      FullName, Email, Password, Phone, Address, City, Birthday
 *  Output:     Bool / Error Message
*/
exports.createUser = function(name, surname, email, password, userType, phone, address_1, address_2, zipcode, city, birth, type) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        // Connection
        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                
                'INSERT INTO User(name, surname, email, password, type, phone, address_1, address_2, zipcode, city, birth) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TIMESTAMP(?))',
                 [name, surname, email, password, userType, phone, address_1, address_2, zipcode, city, birth]
            );

            // Query
            conn.query(query, function (err, result, fields) {
                
                // Error
                if (err) return reject(err);

                // Log user registration
                module.exports.logUserRegistration(result.insertId).then(function(result){

                    resolve(true);

                }).catch(function(err){

                    reject(err);
                });
            });
        });
    });
}



/*
 *  Function:   Create New Activity
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.createActivity = function(name, description, discount, cost, start_time, duration, id_sport, id_facility) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        // Connection
        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                
                'INSERT INTO Activity (name, description, discount, cost, start_time, duration, id_sport, id_facility) VALUES(?, ?, ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID() AS id;',
                 [name, description, discount, cost, start_time, duration, id_sport, id_facility]
            );

            // Query
            conn.query(query, [1,2], function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);
            });
        });
    });
}


exports.updateActivity = function(name, description, discount, cost, start_time, duration, id_sport, id_facility, activityId) {
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        // Connection
        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                
                'UPDATE Activity SET name = ?, description = ?, discount = ?, cost = ?, start_time = ?, duration = ?, id_sport = ?, id_facility = ? WHERE id = ?;',
                    [name, description, discount, cost, start_time, duration, id_sport, id_facility, activityId]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);
            });
        });
    });
}


/*
 *  Function:   Create New User
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.newActivityImage = function(activity_id, image_id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO ActivityImage(id_image, id_activity) VALUES(?, ?);',
                    [image_id, activity_id]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}


exports.deleteActivityImage = function(activity_id, image_id) {
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'DELETE FROM ActivityImage WHERE id_image = ? AND id_activity = ?;',
                    [image_id, activity_id]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(true);
            
            });
        });
    });
}


exports.getActivityImages = function(activity_id) {
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT id, ext FROM Image INNER JOIN ActivityImage ON id = id_image WHERE id_activity = ?;',
                    [activity_id]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });   
}


/*
 *  Function:   Create New User
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.createFacility = function(name, description, price, icon) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO Facility(name, description, price, icon) VALUES(?, ?, ?, ?); SELECT LAST_INSERT_ID() AS id;',
                    [name, description, price, icon]
            );
            
            // Query
            conn.query(query, [1,2], function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}

/*
 *  Function:   Create New User
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.newFacilityImage = function(facility_id, image_id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO FacilityImage(id_image, id_facility) VALUES(?, ?);',
                    [image_id, facility_id]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}


exports.deleteFacilityImage = function(facility_id, image_id) {
    var conn =  getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'DELETE FROM FacilityImage WHERE id_image = ? AND id_facility = ?;',
                    [image_id, facility_id]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(true);
            
            });
        });
    });
}


exports.getFacilityImages = function(facility_id) {
    var conn =  getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT id, ext FROM Image INNER JOIN FacilityImage ON id = id_image WHERE id_facility = ?;',
                    [facility_id]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });   
}






exports.updateFacility = function(name, description, price, icon, facilityId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'UPDATE Facility SET name = ?, description = ?, price = ?, icon = ? WHERE id = ? ',
                    [name, description, price, icon, facilityId]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}


exports.createBooking = function(activity_id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO BookedActivity(id_activity) VALUES(?); SELECT LAST_INSERT_ID() AS id;',
                    [activity_id]
            );
            
            // Query
            conn.query(query, [1,2], function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}

exports.createPaymentCash = function(amount, activity_id, user_id, employee_id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
         
                'INSERT INTO PAYMENT(amount, id_booked_activity, id_user, id_employee) VALUES (?, ?, ?, ?); SELECT LAST_INSERT_ID() AS id;',
                [amount, activity_id, user_id, employee_id]
            );
            
            // Query
            conn.query(query, [1,2], function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}

exports.receiptPaymentCash = function(payment_id) {
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT Payment.id, Payment.purchase_date, BookedActivity.id AS booking_id, Activity.id AS activity_id, Activity.name, cost, amount, User.id AS employee_id, User.name AS employee_name, User.surname AS employee_surname FROM Payment INNER JOIN BookedActivity ON BookedActivity.id = id_booked_activity INNER JOIN Activity ON BookedActivity.id_activity = Activity.id INNER JOIN User ON Payment.id_employee = User.id WHERE Payment.id = ?;',
                    [payment_id]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                if (results.length > 0)
                    resolve(results[0]);

                else
                    reject("Payment not found.");

            });
        });
    });
}


exports.receiptPayment = function(payment_id) {
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'SELECT Payment.*, Card.number, Card.type, BookedActivity.id AS booking_id, Activity.id AS activity_id, Activity.name AS activity_name FROM Payment INNER JOIN Card ON Payment.id_card = Card.id INNER JOIN BookedActivity ON BookedActivity.id = Payment.id_booked_activity INNER JOIN Activity ON BookedActivity.id_activity = Activity.id WHERE Payment.id = ?',
                    [payment_id]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                if (results.length > 0)
                    resolve(results[0]);

                else
                    reject("Payment not found.");

            });
        });
    });
}


/*
 *  Function:   Query Membershops by user id (passed from session)
 *  Input:      User {id}
 *  Output:     Membership {id, start_date, id_user} / Error Message
*/
exports.getUserMemberships = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT Membership.id, Sport.name as sportName, Membership.start_date, Pricing.type FROM Membership INNER JOIN Pricing ON Membership.id_pricing = Pricing.id INNER JOIN Sport ON Sport.id = Pricing.id_sport WHERE id_user = ?',
                    [id]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            });
        });
    });
}

/*
 *  Function:   Delete Membership by id 
 *  Input:      User {id}, Membership {id}
 *  Output:     Boolean Result / Error Message
*/
exports.cancelMembership = function(userId, membershipId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'DELETE FROM Membership WHERE id = ? AND id_user = ?',
                    [membershipId, userId]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(true);

            });
        });
    });
}

/*
 *  Function:   Delete Card by id 
 *  Input:      User {id}, Card {id}
 *  Output:     Boolean Result / Error Message
*/
exports.deleteUserCard = function(userId, cardId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'DELETE FROM Card_User WHERE id_user = ? AND id_card = ?;',
                    [userId, cardId]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(true);

            });
        });
    });
}


/*
 *  Function:   Query payments by user id (passed from session)
 *  Input:      User {id}, Card {id}
 *  Output:     Payments / Error Message
*/
exports.getUserPayments = function(userId, cardId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT Payment.*, Card.number, Card.type, BookedActivity.id AS booking_id, Activity.id AS activity_id, Activity.name AS activity_name FROM Payment INNER JOIN Card ON Payment.id_card = Card.id INNER JOIN BookedActivity ON BookedActivity.id = Payment.id_booked_activity INNER JOIN Activity ON BookedActivity.id_activity = Activity.id WHERE id_user = ? AND Card.id = ?',
                    [userId, cardId]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            });
        });
    });
}


/*
 *  Function:   Query payments by user id (passed from session), only for which are cash payments
 *  Input:      User {id}
 *  Output:     Payments / Error Message
*/
exports.getUserPaymentsCash = function(userId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'SELECT Payment.*, Card.type, BookedActivity.id AS booking_id, Activity.id AS activity_id, Activity.name AS activity_name, Activity.cost AS activity_cost, User.name as user_name, User.surname AS user_surname, User.email as user_email FROM Payment INNER JOIN Card ON Payment.id_card = Card.id INNER JOIN BookedActivity ON BookedActivity.id = Payment.id_booked_activity INNER JOIN Activity ON BookedActivity.id_activity = Activity.id INNER JOIN User ON Payment.id_user = User.id WHERE id_user = ? AND Card.type = "__CASH__"',
                    [userId]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            });
        });
    });
}



/*
 *  Function:   Query payments by employee id (passed from session)
 *  Input:      User {id}
 *  Output:     Payments / Error Message
*/
exports.getEmployeePayments = function(employeeId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(

                'SELECT Payment.*, BookedActivity.id AS booking_id, Activity.id AS activity_id, Activity.name AS activity_name, Activity.cost AS activity_cost, User.name as user_name, User.surname AS user_surname, User.email as user_email FROM Payment INNER JOIN BookedActivity ON BookedActivity.id = Payment.id_booked_activity INNER JOIN Activity ON BookedActivity.id_activity = Activity.id INNER JOIN User ON Payment.id_user = User.id WHERE Payment.id_employee = ?;',
                    [employeeId]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            });
        });
    });
}




/*
 *  Function:   Query payments by user id (passed from session)
 *  Input:      User {id}
 *  Output:     Start Time, Duration, Booking Status (Payment successful/rejected), Facility ID / Error Message
*/
exports.getUserBookings = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT BookedActivity.id, Activity.start_time, Activity.duration, Payment.status AS bookingStatus, Facility.id AS facilityId, Facility.name as facilityName, Sport.name as sportName, Payment.purchase_date as purchaseDate FROM Payment INNER JOIN BookedActivity ON BookedActivity.id = Payment.id_booked_activity INNER JOIN Activity ON Activity.id = BookedActivity.id_activity INNER JOIN Facility ON Activity.id_facility = Facility.id INNER JOIN Sport ON Activity.id_sport = Sport.id WHERE Payment.id_user = ? ORDER BY Activity.start_time ASC;',
                    [id]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            });
        });
    });
}

/*
 *  Function:   Delete Booked Activity
 *  Input:      BookedActivity Id
 *  Output:     Boolean Result / Error Message
*/
exports.cancelBooking = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'DELETE FROM BookedActivity WHERE id = ?',
                    [id]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(true);

            });
        });
    });
}

/*
 *  Function:   Query User by id once logged in
 *  Input:      Id
 *  Output:     User Object / Error Message
*/
exports.getUpcomingActivities = function(no_items, page_no, filters) {

    var conn = getConnection();

    var query_1 = 'SELECT COUNT(*) AS count FROM Activity INNER JOIN Sport ON id_sport = Sport.id INNER JOIN Facility on id_facility = Facility.id WHERE start_time >';
    var query_2 = 'SELECT Activity.id, id_image, ext, Activity.name, Activity.description, discount, cost, start_time, duration, Sport.id AS id_sport, Sport.name AS name_sport, Sport.description AS description_sport, Facility.name AS facility_name, id_facility ' +
                  'FROM Sport INNER JOIN (SELECT * FROM Activity LEFT JOIN (SELECT id_activity, id_image, ext FROM ActivityImage INNER JOIN Image on id_image = id LIMIT 1) AS Image ON id = id_activity) AS Activity ON id_sport = Sport.id INNER JOIN Facility ON Facility.id = id_facility HAVING start_time > ';

    var query_filters = ''

    // add filters to SQL queries
    if (filters.start_date && filters.start_date != '')
        query_filters = SqlString.format(query_filters + ' ? ', [filters.start_date]);
    else
        query_filters += 'CURRENT_TIMESTAMP()';
    if (filters.end_date && filters.end_date != '')
        query_filters = SqlString.format(query_filters + 'AND start_time <= ? ', [filters.end_date]);
    if (filters.sport && filters.sport != '')
        query_filters = SqlString.format(query_filters + 'AND Sport.name = ? ', [filters.sport]);
    if (filters.facility && filters.facility != '')
        query_filters = SqlString.format(query_filters + 'AND Facility.name = ? ', [filters.facility]);

    query_1 += query_filters + ';';
    query_2 += query_filters + 'ORDER BY start_time ASC LIMIT ? OFFSET ?;';

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                query_1 + query_2, [no_items, no_items * (page_no - 1)]
            );
            // Query
            conn.query(query, [1,2], function (err, results, fields) {
                // Error
                if (err) return reject(err);
                
                // Result
                resolve(results);
            
            });
        });
    });
}




/*
 *  Function:   Query User by id once logged in
 *  Input:      Id
 *  Output:     User Object / Error Message
*/
exports.getFacilities = function(no_items, page_no) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(*) AS count FROM Facility;SELECT * FROM Facility ORDER BY id ASC LIMIT ? OFFSET ?',
                    [no_items, no_items * (page_no - 1)]
            );
            
            // Query
            conn.query(query, [1,2], function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}

/*
 *  Function:   Query User by id once logged in
 *  Input:      Id
 *  Output:     User Object / Error Message
*/
exports.getFacility = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Facility WHERE id = ?;SELECT id, ext FROM Image INNER JOIN FacilityImage ON id = id_image WHERE id_facility = ?',
                    [id, id]
            );
            
            // Query
            conn.query(query, [1,2], function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}


exports.deleteFacility = function(facilityId) {
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'DELETE FROM Facility WHERE id = ?',
                    [facilityId]
            ); 

            conn.query(query, function(err, results, fields) {
                if (err) return reject(err);
            
                resolve(true);
                
            });
        });
    });
}



exports.deleteActivity = function(activityId) {
    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'DELETE FROM Activity WHERE id = ?',
                    [activityId]
            ); 

            conn.query(query, function(err, results, fields) {
                if (err) return reject(err);
                
            
                resolve(true);
                
            });
        });
    });
}


/*
 *  Function:   Update Usr Img
 *  Input:      String
 *  Output:     Result / Error Message
*/
exports.newImage = function(ext) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO Image(ext) VALUES(?); SELECT LAST_INSERT_ID() AS id;',
                    [ext]
            );
            
            // Query
            conn.query(query, [1,2], function (err, results, fields) {
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}

/*
 *  Function:   Query User Payment Cards by id once logged in
 *  Input:      User Id
 *  Output:     User Object / Error Message
*/
exports.getUserCards = function(user_id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT Card.id, Card.number, Card.expire_date, Card.type FROM Card_User INNER JOIN Card ON Card.id = Card_User.id_card WHERE Card_User.id_user = ?',
                    [user_id]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);

            });
        });
    });
}

/*
 *  Function:   Create New Card
 *  Input:      FullName, Email, Password, Phone, Address, City, Birthday
 *  Output:     Bool / Error Message
*/
exports.createUserCard = function(userId, req_body) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        // Connection
        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                
                'INSERT INTO Card(number, expire_date, type, cvv) VALUES(?, ?, ?, ?);',
                 [req_body.card_number, req_body.expire_date, req_body.type, req_body.cvv]
            );

            // Query
            conn.query(query, function (err, result, fields) {
                
                // Error
                if (err) return reject(err);

                // Success -> Link card to User
                query = SqlString.format(
                
                    'INSERT INTO Card_User(id_user, id_card) VALUES(?, ?);',
                     [userId, result.insertId]
                );

                // Query
                conn.query(query, function (err, result, fields) {
                    
                    // Error
                    if (err) return reject(err);

                    // Success
                    resolve(true);
                });
            });
        });
    });
}

/*
 *  Function:   Log user registration
 *  Input:      User Id, Logging Type: registration (1)
 *  Output:     Bool / Error Message
*/
exports.logUserRegistration = function(user_id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO Log_User(id_user, type) VALUES(?, ?);',
                    [user_id, 1]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}

/*
 *  Function:   Log user login
 *  Input:      User Id, Logging Type: login (2)
 *  Output:     Bool / Error Message
*/
exports.logUserLogin = function(user_id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO Log_User(id_user, type) VALUES(?, ?);',
                    [user_id, 2]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(results);
            
            });
        });
    });
}

/*
 *  Function:   Query User Login Activity
 *  Output:     User Object / Error Message
*/
exports.getUserLoginActivity = function(start, end) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(id_user) AS users, DAY(time) AS day, MONTH(time) AS month, YEAR(time) AS year FROM Log_User WHERE type = 2 AND time >= DATE(?) AND time <= DATE(?) GROUP BY YEAR(time), MONTH(time), DAY(time) ORDER BY YEAR(time), MONTH(time), DAY(time);',
                [start, end]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);

            });
        });
    });
}

/*
 *  Function:   Query User Login Activity
 *  Output:     User Object / Error Message
*/
exports.getUserRegistrationActivity = function() {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT id_user, time FROM Log_User WHERE type = ?',
                [1]
            );
            
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);

            });
        });
    });
}

/*
 *  Function:   Query Activities per Facility
 *  Input:      Facility {id}
 *  Output:     User Object / Error Message
*/
exports.getFacilityActivities = function(facilityId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Activity WHERE id_facility = ? AND start_time >= NOW()',
                [facilityId]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);

            });
        });
    });
}

/*
 *  Function:   Generate Activity Booking
 *  Input:      Facility {id}, Date
 *  Output:     Timetable / Error Message
*/
exports.getFacilityTimetable = function(facilityId, date) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'SELECT Activity.id, Activity.name AS name_activity, Sport.name AS name_sport, Facility.name AS facility_name, start_time, duration, WEEKDAY(start_time) AS weekday FROM Activity INNER JOIN Sport on id_sport = Sport.id INNER JOIN Facility on id_facility = Facility.id WHERE id_facility = ? AND DAY(start_time) = ? ORDER BY start_time;',
                [facilityId, date]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);

            });
        });
    });
}


/*
 *  Function:   Generate Activity Booking
 *  Input:      Date String
 *  Output:     Activities [] / Error Message
*/
exports.getActivitiesTimetable = function(date) {
    var conn = getConnection();

    return new Promise(function(resolve, reject) {
        conn.connect(function(err) {

            if (err) reject(err);

            query = SqlString.format(
                'SELECT Activity.id, Activity.name AS name_activity, Sport.name AS name_sport, Facility.name AS facility_name, start_time, duration, WEEKDAY(start_time) AS weekday FROM Activity INNER JOIN Sport on id_sport = Sport.id INNER JOIN Facility on id_facility = Facility.id WHERE DAY(start_time) = ? ORDER BY start_time;;',
                [date]
            );

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);

            });
        });
    });
}


/*
 *  Function:   Generate Activity Booking
 *  Input:      Activity {id}
 *  Output:     BookedActivity {id} / Error Message
*/
exports.generateActivityBooking = function(idActivity) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {

            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO BookedActivity(id_activity) VALUES(?);',
                    [idActivity]
            );
            
            // Query
            conn.query(query, function (err, result, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(result.insertId);
            
            });
        });
    });
}

/*
 *  Function:   Generate Booking Payment
 *  Input:      BookedActivity {id}, Activity {cost}, User {id}, Card {id}
 *  Output:     Payment {id} / Error Message
*/
exports.generateBookingPayment = function(bookedActivityId, cost, userId, cardId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {

            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO Payment(id_booked_activity, amount, id_user, id_card) VALUES(?, ?, ?, ?);',
                    [bookedActivityId, cost, userId, cardId]
            );
            
            // Query
            conn.query(query, function (err, result, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(result.insertId);
            
            });
        });
    });
}

/*
 *  Function:   Generate Membership Payment
 *  Input:      BookedActivity {id}, Activity {cost}, User {id}, Card {id}
 *  Output:     Payment {id} / Error Message
*/
exports.generateMembershipPayment = function(membershipId, cost, userId, cardId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {

            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO Payment(id_membership, amount, id_user, id_card) VALUES(?, ?, ?, ?);',
                    [membershipId, cost, userId, cardId]
            );
            
            // Query
            conn.query(query, function (err, result, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                resolve(result.insertId);
            
            });
        });
    });
}


/*
 *  Function:   Get Activity Obj by Id
 *  Input:      Activity {id}
 *  Output:     Activity / Error Message
*/
exports.getActivityObj = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Activity WHERE id = ?',
                [id]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results[0]);

                else
                    reject('No activities found.');
                    
            });
        });
    });
}

/*
 *  Function:   Get Overall Usage per Activity
 *  Input:      Activity {id}
 *  Output:     Activity / Error Message
*/
exports.getOverallActivityUsage = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT Payment.id_user, Payment.purchase_date, Activity.start_time FROM Payment INNER JOIN BookedActivity ON BookedActivity.id = Payment.id_booked_activity INNER JOIN Activity ON Activity.id = BookedActivity.id_activity WHERE Activity.id = ?',
                [id]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No activities found.');     
            });
        });
    });
}

/*
 *  Function:   Get Overall Usage per Activity
 *  Input:      Activity {id}
 *  Output:     Bookings / Error Message
*/
exports.getOverallActivityUsage = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(Payment.id_user) AS users, SUM(Payment.amount) AS income, Payment.purchase_date FROM Payment INNER JOIN BookedActivity ON BookedActivity.id = Payment.id_booked_activity INNER JOIN Activity ON Activity.id = BookedActivity.id_activity WHERE Activity.id = ? GROUP BY Payment.purchase_date ORDER BY Payment.purchase_date',
                [id]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No activities found.');     
            });
        });
    });
}

/*
 *  Function:   Get Weekly Usage per Activity
 *  Input:      Activity {id}, StartDate, EndDate
 *  Output:     Bookings / Error Message
*/
exports.getWeeklyActivityUsage = function(id, start, end) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(Payment.id_user) AS users, SUM(Payment.amount) AS income, Payment.purchase_date FROM Payment INNER JOIN BookedActivity ON BookedActivity.id = Payment.id_booked_activity INNER JOIN Activity ON Activity.id = BookedActivity.id_activity WHERE Activity.id = ? AND Activity.start_time >= DATE(?) AND Activity.start_time <= DATE(?) GROUP BY Payment.purchase_date ORDER BY Payment.purchase_date',
                [id, start, end]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No activities found.');     
            });
        });
    });
}

/*
 *  Function:   Get All Activities ids
 *  Output:     Activity {id} [] / Error Message
*/
exports.getAllActivities = function() {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT Activity.*, Sport.name AS name_sport, Facility.name AS facility_name FROM Activity INNER JOIN Sport on id_sport = Sport.id INNER JOIN Facility on id_facility = Facility.id ORDER BY Activity.id ASC'
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);


                // if (results.length > 0)
                //     resolve(results);

                // else
                //     reject('No bookings found per activity.');         
            });
        });
    });
}

/*
 *  Function:   Get All Facility ids
 *  Output:     Facility {id} [] / Error Message
*/
exports.getAllFacilities = function() {

    var conn =  getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Facility ORDER BY id ASC'
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(results);


                // if (results.length > 0)
                //     resolve(results);

                // else
                //     reject('No bookings found per activity.');       
            });
        });
    });
}

/*
 *  Function:   Get Overall Usage per Facility
 *  Input:      Facility {id}
 *  Output:     Bookings / Error Message
*/
exports.getOverallFacilityUsage = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(Payment.id_user) AS users, SUM(Payment.amount) AS income, Payment.purchase_date FROM Facility INNER JOIN Activity ON Activity.id_facility = Facility.id INNER JOIN BookedActivity ON BookedActivity.id_activity = Activity.id INNER JOIN Payment ON Payment.id_booked_activity = BookedActivity.id WHERE Facility.id = ? GROUP BY Payment.purchase_date ORDER BY Payment.purchase_date',
                [id]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No bookings found per facility.');     
            });
        });
    });
}

/*
 *  Function:   Get Weekly Usage per Facility
 *  Input:      Facility {id}, StartDate, EndDate
 *  Output:     Bookings / Error Message
*/
exports.getWeeklyFacilityUsage = function(id, start, end) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(Payment.id_user) AS users, SUM(Payment.amount) AS income, Payment.purchase_date FROM Facility INNER JOIN Activity ON Activity.id_facility = Facility.id INNER JOIN BookedActivity ON BookedActivity.id_activity = Activity.id INNER JOIN Payment ON Payment.id_booked_activity = BookedActivity.id WHERE Facility.id = ? AND Activity.start_time >= DATE(?) AND Activity.start_time <= DATE(?) GROUP BY Payment.purchase_date ORDER BY Payment.purchase_date',
                [id, start, end]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No activities found.');     
            });
        });
    });
}

/*
 *  Function:   Get All Sport ids and name
 *  Output:     Sport {id, name} [] / Error Message
*/
exports.getAllSports = function() {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Sport ORDER BY id ASC'
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No bookings found per activity.');       
            });
        });
    });
}


/*
 *  Function:   Get Overall Usage per Sport
 *  Input:      Sport {id}
 *  Output:     Bookings / Error Message
*/
exports.getOverallSportUsage = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(Payment.id_user) AS users, SUM(Payment.amount) AS income, Payment.purchase_date FROM Sport INNER JOIN Activity ON Activity.id_sport = Sport.id INNER JOIN BookedActivity ON BookedActivity.id_activity = Activity.id INNER JOIN Payment ON Payment.id_booked_activity = BookedActivity.id WHERE Sport.id = ? GROUP BY Payment.purchase_date ORDER BY Payment.purchase_date',
                [id]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No bookings found per facility.');     
            });
        });
    });
}

/*
 *  Function:   Get Weekly Usage per Sport
 *  Input:      Sport {id}, StartDate, EndDate
 *  Output:     Bookings / Error Message
*/
exports.getWeeklySportUsage = function(id, start, end) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(Payment.id_user) AS users, SUM(Payment.amount) AS income, Payment.purchase_date FROM Sport INNER JOIN Activity ON Activity.id_sport = Sport.id INNER JOIN BookedActivity ON BookedActivity.id_activity = Activity.id INNER JOIN Payment ON Payment.id_booked_activity = BookedActivity.id WHERE Sport.id = ? AND Activity.start_time >= DATE(?) AND Activity.start_time <= DATE(?) GROUP BY Payment.purchase_date ORDER BY Payment.purchase_date',
                [id, start, end]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No usage data found.');     
            });
        });
    });
}

/*
 *  Function:   Get Pricing by Sport Id
 *  Input:      Sport {id}
 *  Output:     Pricing[] / Error Message
*/
exports.getPricingBySport = function(sportId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Pricing WHERE id_sport = ? ORDER BY type ASC',
                [sportId]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No pricing found.');     
            });
        });
    });
}

/*
 *  Function:   Get Pricing By Type
 *  Input:      Type:int
 *  Output:     Pricing[] / Error Message
*/
exports.getPricingByType = function(type) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Pricing WHERE type = ? ORDER BY amount ASC',
                [type]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results);

                else
                    reject('No pricing found.');     
            });
        });
    });
}


/*
 *  Function:   Get Pricing Amount
 *  Input:      Pricing {id}
 *  Output:     Pricing {amount} / Error Message
*/
exports.getPricingAmount = function(id) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT amount FROM Pricing WHERE id = ?',
                [id]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                if (results.length > 0)
                    resolve(results[0].amount);

                else
                    reject('No pricing found.');     
            });
        });
    });
}

/*
 *  Function:   Create Membership
 *  Input:      User {id}, Pricing {id}
 *  Output:     Membership {id} / Error Message
*/
exports.createMembership = function(userId, pricingId) {

    var conn = getConnection();

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO Membership (id_user, id_pricing) VALUES (?, ?)',
                [userId, pricingId]
            );
        
            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Success
                resolve(results.insertId)
            });
        });
    });
}
