const express = require('express');
const validation = require('../modules/validation');
const jwt = require('jsonwebtoken');
var path = require('path');
const router = express.Router();
var user = require('../modules/user');

// Request parsers
var bodyParser = require('body-parser');

// Use this to handle JSON endpoints
var jsonParser = bodyParser.json();

// Use this to handle FORM endpoints
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Website header
const webname = ' The Edgy ';

router.use(express.json());


/*
 *  Function:   Register Backend Query
*/
router.post('/register', urlencodedParser, function(req, res) {

    // Data validation
    try {
        
        const value = validation.registerValidation(req.body);
        
        // Error
        if(value.error != undefined)
            throw value.error;
        
        // Success
        let fullName = req.body.fullName;
        let phone = req.body.phone;
        let address = req.body.address;
        let city = req.body.city;
        let birth = req.body.birth;
        let email = req.body.email;
        let password = req.body.password;

        // Query
        user.registerUser(fullName, email, password, phone, address, city, birth).then(function(result){;

            // Success
            res.send("Register successful.");

        // Error
        }). catch(function(error){
            
            throw error;
        });

    // Error
    } catch(err) {

        // Render with error
        res.render(path.join(__dirname + '/../views/pages/register.ejs'),
        {
            title: webname + "| Register",
            error: err
        });
    }
});


/*
 *  Function:   Login Backend Query
*/
router.post('/login', urlencodedParser, function(req, res) {

    try { 
        // Validation
        const value = validation.loginValidation(req.body);
        
        if(value.error != undefined) {
            console.log(value.error);
            throw value.error.details;
        }

        // Data
        let email = req.body.email;
        let password = req.body.password;

        // Query
        user.loginUser(email, password).then(function(user){

            console.log(user.id);

            /*

                // Session creation
                const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
                res.header('auth-token',token).send(token);

            */

            // TODO: redirect to my account 
            res.send("Login successful.");

        // Error
        }). catch(function(error){
            
            throw error;
        });

    } catch(err) {

        // Render with error
        res.render(path.join(__dirname + '/../views/pages/login.ejs'),
        {
            title: webname + "| Login",
            error: err
        });
    }
});

module.exports = router;