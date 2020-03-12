
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const validation = require('../modules/validation');
var moment = require('moment');

var user = require('../modules/user');
//var employee = require('../modules/employee');
var busboy = require('busboy');
var fs = require('fs');
var urlEncoded = bodyParser.urlencoded({ extended: true });
var jsonEncoded = bodyParser.json();

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));

// Website header
const webname = ' The Edgy ';

/*
 *  Function:   Login API Endpoind
*/
router.post('/login', jsonEncoded, function(req, res) {

    try { 
        // Validation
        const value = validation.apiLoginValidation(req.body);
        
        if(value.error != undefined) {
            throw value.error.details;
        }

        // Data
        let email = req.body.email;
        let password = req.body.password;

        // Query
        user.loginUser(email, password).then(function(user){

            /*

                // Session creation
                const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
                res.header('auth-token',token).send(token);

            */

           res.setHeader('Content-Type', 'application/json');
           res.end(
               JSON.stringify(user)
           );

        // Error
        }). catch(function(err){

            res.setHeader('Content-Type', 'application/json');
            res.end(
                JSON.stringify(err)
            );
        });

    } catch(err) {

        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(err)
        );
    }
    
    
});


/*
 *  Function:   Register API Endpoind
*/
router.post('/register', jsonEncoded, function(req, res) {

    try { 
        // Validation
        const value = validation.apiRegisterValidation(req.body);
        
        if(value.error != undefined) {
            throw value.error.details;
        }

        // Formatting
        req.body.birth = moment(req.body.birth).format('YYYY-MM-DD');

        // Query
        user.registerUser(req.body).then(function(result){

            /*

                // Session creation
                const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
                res.header('auth-token',token).send(token);

            */

           res.setHeader('Content-Type', 'application/json');
           res.end(
               JSON.stringify(result)
           );

        // Error
        }). catch(function(err){

            res.setHeader('Content-Type', 'application/json');
            res.end(
                JSON.stringify(err)
            );
        });

    } catch(err) {

        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(err)
        );
    }
});


/*
 *  Function:   Upload file API Endpoint
*/
router.post('/upload', jsonEncoded, function(req, res) {

    // Upload the file bby
    var bboy = new busboy({ headers : req.headers });
    
    bboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        output_path = __dirname + '/../src/uploads/' + filename;
    
        // break if invalid filetype
        if (!(mimetype == 'image/png' || mimetype == 'image/jpg' || mimetype == 'image/jpeg'))
            return res.end('invalid filetype!');
        
        file.pipe(fs.createWriteStream(output_path));
        return res.end('ok');
    });
    
    return req.pipe(bboy);
});


/*
 *  Function:   New activity API Endpoint
*/

router.post('/new_activity', jsonEncoded, function(req, res) {

    try { 
        // Validation
        console.log('got here');
        console.log(req.body)
        
        const value = validation.apiNewActivityValidation(req.body);
        
        if(value.error != undefined) {
            throw value.error.details;
        }

        // Query
        /*
        employee.newActivity(req.body).then(function(result){            

            // Session creation
            const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
            res.header('auth-token',token).send(token);

           res.setHeader('Content-Type', 'application/json');
           res.end(
               JSON.stringify(result)
           );

        // Error
        }). catch(function(err){

            res.setHeader('Content-Type', 'application/json');
            res.end(
                JSON.stringify(err)
            );
        });
        */

    } catch(err) {

        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(err)
        );
    }
});



module.exports = router;