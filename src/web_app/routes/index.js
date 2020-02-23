
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');

const webname = ' The Edgy ';


// Routes
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

router.get('/login', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/login.ejs'),
    {
        title: webname + "| Login"
    });
});

router.get('/memberships', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/memberships.ejs'),
    {
        title: webname + "| Memberships"
    });
});


router.get('/facilities', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/facilities.ejs'),
    {
        title: webname + "| Facilities"
    });
});

router.get('/contact', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/contact.ejs'),
    {
        title: webname + "| Contact"
    });
});

module.exports = router;