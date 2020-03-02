const express = require('express');
const validation = require('./validation');
const jwt = require('jsonwebtoken');
const router = express.Router();

var userDB = require('../modules/user');
const webname = ' The Edgy ';

router.use(express.json());


// Routes
router.post('/register', async function(req, res) {

    try{
        const value = validation.registerValidation(req.body);
        
        if(value.error != undefined){
            return res.status(400).send(value.error.message)
        }
        
        //OTHERWISE SAVE THE USER IN A DB

        res.send(value);

    }catch(err){
        res.status(400).send(err);
    }
    
    res.send(user);

});

router.post('/login', async function(req, res){

    //TODO: change fora db validation
    const value = validation.loginValidation(req.body);
    
    if(value.error != undefined){
        return res.status(400).send(value.error.message)
    }

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

});

module.exports = router;