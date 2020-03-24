var mysql = require('mysql');
var SqlString = require('sqlstring');

let host = "127.0.0.1"
let db = "comp2913_sep"
let user = "web_comp2913"
let psw = ""
let port = 3306

/*
 *  Function:   Check for email registration existance
 *  Input:      Email
 *  Output:     Bool / Error Message
*/
exports.checkEmailRegistered = function(email) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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
                    resolve(true);

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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
    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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
    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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
 *  Function:   Create New User
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.createActivity = function(name, description, discount, cost, start_time, duration, id_sport, id_facility) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

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

/*
 *  Function:   Create New User
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.newActivityImage = function(activity_id, image_id) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
    });

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


/*
 *  Function:   Create New User
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.createFacility = function(name, description, price, latitude, longitude, icon) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'INSERT INTO Facility(name, description, price, latitude, longitude, icon) VALUES(?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID() AS id;',
                    [name, description, price, latitude, longitude, icon]
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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
    });

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

/*
 *  Function:   Query Membershops by user id (passed from session)
 *  Input:      User {id}
 *  Output:     Membership {id, validity, start_date, id_user, id_sport} / Error Message
*/
exports.getUserMemberships = function(id) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Membership INNER JOIN Sport ON Membership.id_sport = Sport.id WHERE id_user = ?',
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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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
 *  Input:      User {id}
 *  Output:     Payments / Error Message
*/
exports.getUserPayments = function(userId) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT * FROM Payment WHERE id_user = ?',
                    [userId.id]
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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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
exports.getUpcomingActivities = function(no_items, page_no) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT COUNT(*) AS count FROM Activity WHERE start_time > CURRENT_TIMESTAMP();SELECT Activity.id, id_image, ext, Activity.name, Activity.description, discount, cost, start_time, duration, Sport.id AS id_sport, Sport.name AS name_sport, Sport.description AS description_sport, Facility.name AS facility_name, id_facility FROM Sport INNER JOIN (SELECT * FROM Activity LEFT JOIN (SELECT id_activity, id_image, ext FROM ActivityImage INNER JOIN Image on id_image = id LIMIT 1) AS Image ON id = id_activity) AS Activity ON id_sport = Sport.id INNER JOIN Facility on id_facility ORDER BY start_time ASC LIMIT ? OFFSET ?;',
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



exports.getAllFacilities = function() {
    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                'SELECT * FROM Facility ORDER BY id ASC',
            );

            conn.query(query, function (err, results, fields) {  
                // Error
                if (err) return reject(err);

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

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

/*
 *  Function:   Update Usr Img
 *  Input:      String
 *  Output:     Result / Error Message
*/
exports.newImage = function(ext) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

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
                     [userId.id, result.insertId]
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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
    });

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
exports.getUserLoginActivity = function() {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

    // Synching request
    return new Promise(function(resolve, reject) {

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
        
                'SELECT id_user, time FROM Log_User WHERE type = ?',
                [2]
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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

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

// one big query to get the timetable
exports.getFacilityTimetable = function(facilityId, date) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
    });

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



exports.getActivitiesTimetable = function(date) {
    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
    });

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

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
    });

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
 *  Function:   Generate Payment
 *  Input:      BookedActivity {id}, Activity {cost}, User {id}, Card {id}
 *  Output:     Payment {id} / Error Message
*/
exports.generatePayment = function(bookedActivityId, cost, userId, cardId) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
    });

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
 *  Function:   Get Activity Obj by Id
 *  Input:      Activity {id}
 *  Output:     Activity / Error Message
*/
exports.getActivityObj = function(id) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db,
        multipleStatements: true
    });

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