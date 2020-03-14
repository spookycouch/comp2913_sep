
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
var employee = require('../modules/employee');
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


router.post('/upload_facility', jsonEncoded, function(req, res) {

    // Validation
    var bboy = new busboy({ headers : req.headers });
    
    // Fields - push to json
    bboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log(val);
    });

    // Files - upload images and append image id to list
    bboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var ext = mimetype.split('/')[1];

        // validate img type
        if (!(mimetype == 'image/png' || mimetype == 'image/jpg' || mimetype == 'image/jpeg'))
            return res.end('invalid filetype!');

        // create db entry then save image to src/uploads/ using returned id
        employee.newImage(ext).then(function(results){
            var id = results[1][0].id;
            var output_path = __dirname + '/../src/uploads/' + id + '.' + ext;
            file.pipe(fs.createWriteStream(output_path));

        }).catch(function(err){

            return res.end('file upload error');
        });
    });

    bboy.on('finish', function() {
        console.log('done');
        res.end('done');
    });

    try {
        return req.pipe(bboy);
    } catch(err) {

        res.setHeader('Content-Type', 'application/json');
        res.end(
            JSON.stringify(err)
        );
    }
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
        employee.newActivity(req.body).then(function(result){            

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


module.exports = router;