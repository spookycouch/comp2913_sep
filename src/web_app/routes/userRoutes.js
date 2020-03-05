const express = require('express');
const validation = require('../modules/validation');
const jwt = require('jsonwebtoken');
var path = require('path');
const router = express.Router();
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csurf({ cookie: true }));

// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Register Backend Query
*/
router.post('/register', function(req, res) {

    // Data validation
    try {
        
        const value = validation.registerValidation(req.body);   

        // Error
        if(value.error != undefined)
            throw value.error.details;

        // Query
        user.registerUser(req.body).then(function(result){

            // Success
            // TODO: redirect to the page set in session
            res.redirect('/user/login');

        // Error
        }). catch(function(error){

            // Render with error
            res.render(path.join(__dirname + '/../views/pages/register.ejs'),
            {
                title: webname + "| Register",
                error: error,
                form: req.body,
                csrfToken: req.csrfToken()
            });
        });

    // Error
    } catch(err) {

        // Render with error
        res.render(path.join(__dirname + '/../views/pages/register.ejs'),
        {
            title: webname + "| Register",
            error: err,
            form: req.body,
            csrfToken: req.csrfToken()
        });
    }
});


/*
 *  Function:   Login Backend Query
*/
router.post('/login', function(req, res) {

    try { 
        // Validation
        const value = validation.loginValidation(req.body);
        
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

            // TODO: redirect to my account 
            res.redirect('/account');

        // Error
        }). catch(function(err){

            var error = [{
                message: err,
                path: 'email'
            }];
            // Render with error
            // need to duplicate because !compatible(promises, try-catch)
            res.render(path.join(__dirname + '/../views/pages/login.ejs'),
            {
                title: webname + "| Login",
                error: error,
                form: req.body,
                csrfToken: req.csrfToken()
            });
        });

    } catch(err) {

        // Render with error
        res.render(path.join(__dirname + '/../views/pages/login.ejs'),
        {
            title: webname + "| Login",
            error: err,
            form: req.body,
            csrfToken: req.csrfToken()
        });
    }
});



router.get('/account', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/account/account.ejs'),
    {
        title: webname + "| Account"
    });
});

module.exports = router;