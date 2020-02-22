var mysql = require('mysql');

let host = "127.0.0.1"
let db = "comp2913_sep"
let user = "web_comp2913"
let psw = ""
let port = 3306

/*
 *  Function:   Query User by username
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
            
            query = "SELECT * FROM User WHERE email = '" 
                    + email + "' AND password = '" 
                    + password + "'";

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

        conn.connect(function(err) {
            
            // Error 
            if (err) reject(err);
            
            query = "INSERT INTO User(full_name, email, password, phone, address, city, birth) VALUES(" + 
                    "'" + fullName + "', " +
                    "'" + email + "', " +
                    "'" + password + "', " +
                    "'" + phone + "', " +
                    "'" + address + "', " +
                    "'" + city + "', " +
                    "TIMESTAMP('" + birth + "'));";

            // Query
            conn.query(query, function (err, results, fields) {
                
                // Error
                if (err) return reject(err);

                resolve(true);
            });
        });
    });
}
