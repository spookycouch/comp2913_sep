const joi = require('@hapi/joi');

/*
 *  Function:   Register Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const registerValidation = function(data){

    const registerValidationSchema = joi.object({
        name: joi.string()
            .min(3)
            .required(),
        surname: joi.string()
            .min(3)
            .required(),
        email: joi.string()
            .min(6)
            .required()
            .email(),
        birth: joi.string()
            .required(),
        phone: joi.number()
            .required(),
        address_1: joi.string()
            .required(),
        address_2: joi.string()
            .allow(''),
        zipcode: joi.string()
            .required(),
        city: joi.string()
            .required(),
        password: joi.string()
            .min(6)
            .required(), // Need another field, confirm password, which must be validated to be equal to password.
        confirm_password: joi.string()
            .min(6)
            .required(), // Need another field, confirm password, which must be validated to be equal to password.
        _csrf: joi.string()
            .min(6)
            .required()
        
    });

    return registerValidationSchema.validate(data, {abortEarly: false});
}

/*
 *  Function:   API Register Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const apiRegisterValidation = function(data){

    const registerValidationSchema = joi.object({
        name: joi.string()
            .min(3)
            .required(),
        surname: joi.string()
            .min(3)
            .required(),
        email: joi.string()
            .min(6)
            .required()
            .email(),
        birth: joi.string()
            .required(),
        phone: joi.number()
            .required(),
        address_1: joi.string()
            .required(),
        address_2: joi.string()
            .allow(''),
        zipcode: joi.string()
            .required(),
        city: joi.string()
            .required(),
        password: joi.string()
            .min(6)
            .required(), // Need another field, confirm password, which must be validated to be equal to password.
        confirm_password: joi.string()
            .min(6)
            .required(), // Need another field, confirm password, which must be validated to be equal to password.
        
    });

    return registerValidationSchema.validate(data, {abortEarly: false});
}

/*
 *  Function:   Login Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const loginValidation = function(data){

    const LoginValidationSchema = joi.object({
        email: joi.string()
            .min(6)
            .required()
            .email(),
        password: joi.string()
            .min(6)
            .required(),
        _csrf: joi.string()
            .min(6)
            .required()
    });
    
    return LoginValidationSchema.validate(data);
}

/*
 *  Function:   API Login Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const apiLoginValidation = function(data){

    const LoginValidationSchema = joi.object({
        email: joi.string()
            .min(6)
            .required()
            .email(),
        password: joi.string()
            .min(6)
            .required(),
    });
    
    return LoginValidationSchema.validate(data);
}


/*
 *
 *
 *
*/

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.apiLoginValidation = apiLoginValidation;
module.exports.apiRegisterValidation = apiRegisterValidation;