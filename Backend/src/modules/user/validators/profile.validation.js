const Joi = require('joi');

const profileValidation= (req)=>{
    const schema =  new Joi.object({
        firstName : Joi.string().max(25).trim().messages({
            "string.max": "First name should not be more than 3 characters."
        }),
        lastName  : Joi.string().max(25).trim().messages({
            "string.max": "Last name should not be more than 3 characters."
        }),
        username  : Joi.string().min(5).max(50).trim().alphanum().messages({
            "string.max": "username should not be more than 3 characters."
        }),
        gender: Joi.string().trim().alphanum().valid('female', 'male').messages({
            'any.only': 'Gender must be only female or male.',
        }),
        birthday: Joi.date().iso().messages({
            'date.base': 'Birthday must be a valid date.',
            'date.isoDate': 'Birthday must be in ISO 8601 format (YYYY-MM-DD).'
        })
    }).unknown();

    const {value, error} = schema.validate(req);
    return  {value, error};
} 

const passwordValidation = (req)=>{
    const schema =  new Joi.object({
    
        newPassword : Joi.string().min(6).max(25).required().trim().messages({
            "string.empty": "New password is required.",
            "string.min": "Password should not be less than 6 characters.",
            "string.max": "Password should not be more than 25 characters."
        }),
        confirmPassword: Joi.string().min(6).trim()
        .valid(Joi.ref('newPassword')).messages({ "string.empty": "Confirm password is required.", 'any.only': 'Passwords do not match'}),

    }).unknown();

    const {value, error} = schema.validate(req);
    return  {value, error};
};
module.exports = {
    profileValidation,
    passwordValidation
}