
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
 *  Function:   Delete Membership by id
*/
router.get('/memberships/:id*', function(req, res, next) {
    
    if(req.session.userId != undefined){

        user.cancelMembership(req.session.userId, req.params['id']).then(function(){

            // Success, redirect
            res.redirect('/user/account/memberships');

        // Error page
        }).catch(function(err){

            console.log(err);
        });
    }
});


module.exports = router;