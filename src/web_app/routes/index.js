
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');

// Request parsers
var bodyParser = require('body-parser');

// Use this to handle JSON endpoints
var jsonParser = bodyParser.json();

// Use this to handle FORM endpoints
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Website header
const webname = ' The Edgy ';

/*
 *  Function:   Homepage Router
*/
router.get(['/', '/home'], function(req, res) {
    
    //user.registerUser("Diego Calanzone", "diegocalanzone@gmail.com", "123", "123", "Leeds", "Leeds", 1582394167);
    //user.loginUser("john.d@mail.com", "123").then(function(user){

        //console.log(user);

        res.render(path.join(__dirname + '/../views/pages/index.ejs'),
        {
            title: webname + "| Home"
        });
    //}).catch(function(error){});
});

/*
 *  Function:   Login Page Router
*/
router.get('/login', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/login.ejs'),
    {
        title: webname + "| Login"
    });
});

/*
 *  Function:   Login Backend Query
*/
router.post('/login', urlencodedParser, function(req, res) {

    // Data
    let email = req.body.email;
    let password = req.body.password;

    // Query
    user.loginUser(email, password).then(function(user){

        // Success
        res.send("Login successful.");

    // Error
    }). catch(function(error){
        
        res.send(error);
    });
});

/*
 *  Function:   Memberships Page Router
*/
router.get('/memberships', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/memberships.ejs'),
    {
        title: webname + "| Memberships"
    });
});

/*
 *  Function:   Facilities Page Router
*/
router.get('/facilities', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
    {
        title: webname + "| Facilities"
    });
});

/*
 *  Function:   Contact Page Router
*/
router.get('/contact', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/contact.ejs'),
    {
        title: webname + "| Contact"
    });
});

module.exports = router;