var mysql = require('mysql');
var SqlString = require('sqlstring');

let host = "127.0.0.1"
let db = "comp2913_sep"
let user = "web_comp2913"
let psw = ""
let port = 3306

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
                    reject("Unsuccessful login.")

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
