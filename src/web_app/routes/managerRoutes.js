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

var csrf = csurf({ cookie: true });

// Website header
const webname = ' The Edgy ';



router.get('/register/employee', function(req, res) {
    res.render(path.join(__dirname + '/../views/pages/manager/employee_new.ejs'), {
        title: webname + "| Register | Employee",
        session: req.session,
        csrfToken: req.csrfToken()
    });
});


router.post('/register/employee', function(req, res) {

    user.registerUser(req.body).then(function(result) {

        res.render(path.join(__dirname + '/../views/pages/manager/employee_new.ejs'), {
            title: webname + "| Register | Employee",
            session: req.session,
            csrfToken: req.csrfToken()
        });

    }).catch(function(err) {
        console.log(err);
        res.redirect('/manager/overview');
    }) 

    
});


/*
 * Function:    Manager overview page
*/
router.get('/overview', function(req, res) { 
    res.render(path.join(__dirname + '/../views/pages/manager/account_manager.ejs'), {
        title: webname + "| Manager | Overview",
        session: req.session
    });
});


/*
 * Function:    Test new activity
*/
router.get('/activities/new', csrf, function (req, res) {   
    if(req.session.userId == undefined || req.session.userType < 3) // If not an admin
        res.redirect('/home');

    return res.render(path.join(__dirname + '/../views/pages/manager/activities_new.ejs'), {
        title: webname + "| Activities | New"
    });
})


/*
 * Function:    Test new facility
*/
router.get('/facilities/new', csrf, function (req, res) {
    if(req.session.userId == undefined || req.session.userType < 3) // if not an admin
        res.redirect('/home');

    return res.render(path.join(__dirname + '/../views/pages/manager/facilities_new.ejs'), {
        title: webname + "| Facilities | New"
    });
})



module.exports = router;