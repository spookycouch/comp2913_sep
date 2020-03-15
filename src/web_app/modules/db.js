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
                if (results.length > 0)
                    resolve(results[0]);

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
exports.getUserId = function(email) {

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
        
                'SELECT id FROM User WHERE email = ?',
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
        
                'SELECT id, name, surname, email, birth, phone, address_1, address_2 city, zipcode, profile_pic FROM User WHERE id = ?',
                    [id.id]
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
exports.updateUserDetails = function(id, name, surname, email, password, phone, address_1, address_2, zipcode, city, profile_pic) {

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
        
                'UPDATE User SET name = ?, surname = ?, email = ?, phone = ?, address_1 = ?, address_2 = ?, zipcode = ?, city = ?, profile_pic = ? WHERE id = ?',
                    [name, surname, email, phone, address_1, address_2, zipcode, city, profile_pic, id]
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


/*
 *  Function:   Create New User
 *  Input:      FullName, Email, Password, Phone, Address, City, Birthday
 *  Output:     Bool / Error Message
*/
exports.createUser = function(name, surname, email, password, phone, address_1, address_2, zipcode, city, birth) {

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
                
                'INSERT INTO User(name, surname, email, password, phone, address_1, address_2, zipcode, city, birth) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, TIMESTAMP(?))',
                 [name, surname, email, password, phone, address_1, address_2, zipcode, city, birth]
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
 *  Function:   Create New User
 *  Input:      Discount, Cost, Start Time, Duration, Sport ID
 *  Output:     Bool / Error Message
*/
exports.createActivity = function(discount, cost, start_time, duration, id_sport) {

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
                
                'INSERT INTO Activity (discount, cost, start_time, duration, id_sport) VALUES(?, ?, ?, ?, ?)',
                 [discount, cost, start_time, duration, id_sport]
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
                    [id.id]
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
                    [membershipId, userId.id]
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
exports.getUserPayments = function(id) {

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
                    [id.id]
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
        
                'SELECT Activity.start_time, Activity.duration, Payment.status AS bookingStatus, Facility.id AS facilityId, Facility.name as facilityName, Sport.name as sportName FROM Payment INNER JOIN BookedActivity ON BookedActivity.id = Payment. id_booked_activity  INNER JOIN Activity ON Activity.id = BookedActivity.id_activity INNER JOIN Activity_Timetable ON Activity.id = Activity_Timetable.id_activity INNER JOIN Facility ON Activity_Timetable.id_timetable = Facility.id_timetable INNER JOIN Sport ON Activity.id_sport = Sport.id WHERE Payment.id_user = ? ORDER BY Activity.start_time ASC',
                    [id.id]
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
        
                'SELECT COUNT(*) AS count FROM Activity WHERE start_time > CURRENT_TIMESTAMP();SELECT Activity.id, discount, cost, start_time, duration, id_sport, name, description FROM Sport INNER JOIN (SELECT * FROM Activity WHERE start_time > CURRENT_TIMESTAMP() ORDER BY start_time ASC LIMIT ? OFFSET ?) AS Activity ON Sport.id = Activity.id_sport;',
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