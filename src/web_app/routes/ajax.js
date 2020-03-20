
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const validation = require('../modules/validation');

var urlEncoded = bodyParser.urlencoded({ extended: true });
var jsonEncoded = bodyParser.json();

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));

// Website header
const webname = ' The Edgy ';

/*
 *  Function:   Register Backend Query (for Registration subform 1)
*/
router.post('/register/response-1', function(req, res) {
    
    try {
        const value = validation.registerValidation1(req.body);   

        // Error
        if(value.error != undefined)
            throw value.error.details;
        
        // Email check
        user.checkEmailRegistered(req.body.email).then(function(result) {

            // Email already existing
            if(result == true) throw [{
                message: 'Email already registered',
                path: 'email'
            }];

             // Response
            res.end(JSON.stringify({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                confirm_password: req.body.confirm_password
            }));

        }).catch(function(err){

            // Error
           res.end(JSON.stringify({
                error: err
            }));

        });

    } catch(err) {

        // Error
        res.end(JSON.stringify({
            error: err
        }));
    }
});


/*
 *  Function:   Register Backend Query (for Registration subform 2)
*/
router.post('/register/response-2', function(req, res) {
    
    try {
        const value = validation.registerValidation2(req.body);

        // Error
        if(value.error != undefined)
            throw value.error.details;

        res.end(JSON.stringify({
            birth: req.body.birth,
            phone: req.body.phone
        }));

    } catch(err) {

        res.end(JSON.stringify({
            error: err
        }));
    }
});


/*
 *  Function:   Register Backend Query (for Registration subform 3)
*/
router.post('/register/response-3', function(req, res) {
    try {
        const value = validation.registerValidation3(req.body);
        
        // Error
        if(value.error != undefined)
            throw value.error.details;

        res.end(JSON.stringify({
            address_1: req.body.address_1,
            address_2: req.body.address_2,
            city: req.body.city,
            zipcode: req.body.zipcode
        }));

    } catch(err) {

        res.end(JSON.stringify({
            error: err
        }));
    }
});


module.exports = router;