
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

    res.render(path.join(__dirname + '/../views/pages/index.ejs'),
    {
        title: webname + "| Home"
    });
});

/*
 *  Function:   Register Page Router
*/
router.get('/register', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/register.ejs'),
    {
        title: webname + "| Register"
    });
});

/*
 *  Function:   Register Backend Query
*/
router.post('/register', urlencodedParser, function(req, res) {

    // Data
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
        
        res.send(error);
    });
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