var mysql = require('mysql');
<<<<<<< HEAD
=======
var SqlString = require('sqlstring');
>>>>>>> web_app

let host = "127.0.0.1"
let db = "comp2913_sep"
let user = "web_comp2913"
let psw = ""
let port = 3306

/*
<<<<<<< HEAD
 *  Function:   Query User by username
=======
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
>>>>>>> web_app
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
<<<<<<< HEAD
            
            query = "SELECT * FROM User WHERE email = '" 
                    + email + "' AND password = '" 
                    + password + "'";
=======

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
        
                'SELECT full_name, email, phone, address, city, birth, profile_pic FROM User WHERE id = ?',
                    [id]
            );
>>>>>>> web_app

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                // Result
                if (results.length > 0)
                    resolve(results[0]);

                else
<<<<<<< HEAD
                    reject("Unsuccessful login.")
=======
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
exports.changeUserDetails = function(id, name, surname, email, password, phone, address_1, address_2, zipcode, city, profile_pic) {

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
>>>>>>> web_app

            });
        });
    });
}


/*
 *  Function:   Create New User
 *  Input:      FullName, Email, Password, Phone, Address, City, Birthday
 *  Output:     Bool / Error Message
*/
<<<<<<< HEAD
exports.createUser = function(fullName, email, password, phone, address, city, birth) {
=======
exports.createUser = function(name, surname, email, password, phone, address_1, address_2, zipcode, city, birth) {
>>>>>>> web_app

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

    // Synching request
    return new Promise(function(resolve, reject) {

<<<<<<< HEAD
=======
        // Connection
>>>>>>> web_app
        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);
<<<<<<< HEAD
            
            query = "INSERT INTO User(full_name, email, password, phone, address, city, birth) VALUES(" + 
                    "'" + fullName + "', " +
                    "'" + email + "', " +
                    "'" + password + "', " +
                    "'" + phone + "', " +
                    "'" + address + "', " +
                    "'" + city + "', " +
                    "TIMESTAMP('" + birth + "'));";
=======

            query = SqlString.format(
                
                'INSERT INTO User(name, surname, email, password, phone, address_1, address_2, zipcode, city, birth) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, TIMESTAMP(?))',
                 [name, surname, email, password, phone, address_1, address_2, zipcode, city, birth]
            );
>>>>>>> web_app

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(true);
            });
        });
    });
}
