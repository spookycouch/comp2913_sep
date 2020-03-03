var mysql = require('mysql');
var SqlString = require('sqlstring');
var moment = require('moment');

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

    // SQL Validation
    email = SqlString.escape(email);
    password = SqlString.escape(password);

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
 *  Function:   Create New User
 *  Input:      FullName, Email, Password, Phone, Address, City, Birthday
 *  Output:     Bool / Error Message
*/
exports.createUser = function(fullName, email, password, phone, address, city, birth) {

    var conn = mysql.createConnection({
        host: host,
        user: user,
        password: psw,
        database: db
    });

    // Synching request
    return new Promise(function(resolve, reject) {

        // Timestamp validity & conversion
        birth = new Date(birth * 1000);
        if(birth.getTime() <= 0) reject("Invalid Timestamp");
        birth = moment(birth).format('YYYY-MM-DD HH:mm:ss');

        // Connection
        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);

            query = SqlString.format(
                
                'INSERT INTO User(full_name, email, password, phone, address, city, birth) VALUES(?, ?, ?, ?, ?, ?, TIMESTAMP(?))',
                 [fullName, email, password, phone, address, city, birth]
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
