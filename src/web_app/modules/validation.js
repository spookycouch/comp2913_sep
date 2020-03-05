const joi = require('@hapi/joi');

//validation
const registerValidation = function(data){

    const registerValidationSchema = joi.object({
        fullName: joi.string()
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
        address: joi.string()
            .required(),
        city: joi.string()
            .required(),
        password: joi.string()
            .min(6)
            .required(), // Need another field, confirm password, which must be validated to be equal to password.
        _csrf: joi.string()
            .min(6)
            .required()
        
    });

    return registerValidationSchema.validate(data, {abortEarly: false});
}

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
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;