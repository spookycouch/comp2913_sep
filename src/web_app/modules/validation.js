const joi = require('@hapi/joi');

/*
 *  Function:   Register form (whole form) Validation 
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
            .required(), 
        confirm_password: joi.any()
            .valid(joi.ref('password'))
            .required()
            .messages({
                "any.only": "Must match Password"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
        
    });

    return registerValidationSchema.validate(data, {abortEarly: false});
}


/*
 *  Function:   Register form (subform 1) Validation 
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const registerValidation1 = function(data) {
    const registerValidationSchema1 = joi.object({
        name: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Firstname is required",
                "string.min": "Firstname must be at least 3 characters long"
            }),
        surname: joi.string()
            .min(3)
            .required()
            .messages({
                "string.empty": "Surname is required",
                "string.min": "Surname must be at least 3 characters"
            }),
        email: joi.string()
            .min(6)
            .required()
            .email()
            .messages({
                "string.empty": "Email is Required",
                "string.min": "Email must be at least 6 characters long",
                "string.email": "Invalid Email Address"
            }),
        password: joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is Required",
                "string.min": "Password must be at least 6 characters long"
            }),
        confirm_password: joi.any()
            .valid(joi.ref('password'))
            .required()
            .messages({
                "string.empty": "Confirm Password is Required",
                "any.only": "Must match Password"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });


    return registerValidationSchema1.validate(data, {abortEarly: false});
}


/*
 *  Function:   Register form (subform 2) Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const registerValidation2 = function(data) {
    const registerValidationSchema2 = joi.object({
        birth: joi.string()
            .required()
            .messages({
                "string.empty": "Date of Birth is Required"
            }),
        phone: joi.number()
            .required()
            .messages({
                "number.base": "Phone Number Invalid"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return registerValidationSchema2.validate(data, {abortEarly: false});
}   


/*
 *  Function:   Register form (subform 3) Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const registerValidation3 = function(data) {
    const registerValidationSchema3 = joi.object({
        address_1: joi.string()
            .required()
            .messages({
                "string.empty": "Address Line 1 is Required"
            }),
        address_2: joi.string()
            .allow(''),
        zipcode: joi.string()
            .required()
            .messages({
                "string.empty": "Postal / Zip Code is Required"
            }),
        city: joi.string()
            .required()
            .messages({
                "string.empty": "City is Required"
            }),
        _csrf: joi.string()
            .min(6)
            .required()
    });

    return registerValidationSchema3.validate(data, {abortEarly: false});
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
            .email()
            .messages({
                "string.empty": "Email is Required",
                "string.min": "Email must be at least 6 characters long",
                "string.email": "Invalid Email Address"
            }),
        password: joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is Required",
                "string.min": "Password must be at least 6 characters long"
            }),
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
 *  Function:   API New Activity Validation
 *  Input:      Request Body
 *  Output:     Null/Error Object
*/
const apiNewActivityValidation = function(data){

    const registerValidationSchema = joi.object({
        image: joi.any()
            .allow(''),
        discount: joi.string()
            .required(),
        cost: joi.string()
            .required(),
        start_time: joi.string()
            .required(),
        duration: joi.string()
            .required(),
        id_sport: joi.number()
            .required(),
    });

    return registerValidationSchema.validate(data, {abortEarly: false});
}


module.exports.registerValidation = registerValidation;         // Registration (whole form)
module.exports.registerValidation1 = registerValidation1;       // Registration (subform 1)
module.exports.registerValidation2 = registerValidation2;       // Registration (subform 2)
module.exports.registerValidation3 = registerValidation3;       // Registration (subform 3)
module.exports.loginValidation = loginValidation;               // Login
module.exports.apiLoginValidation = apiLoginValidation;         // ApiLogin
module.exports.apiRegisterValidation = apiRegisterValidation;   // ApiRegister
module.exports.apiNewActivityValidation = apiNewActivityValidation; //ApiNewActivity
