const Joi = require('joi');

const schemas = {
    email: Joi.object({
        email     : Joi.string().max(100).email().required().trim().messages({
            "string.empty": "Email is required.",
        }),
    }).unknown(),

    phone: Joi.object({
        phone     : Joi.string().max(14).required().trim(),
    }).unknown(),

    completeData: Joi.object({
        firstName : Joi.string().max(25).required().trim().messages({
            "string.empty": "First name is required.",
            "string.max": "First name should not be more than 25 characters."
        }),
        lastName  : Joi.string().max(25).required().trim().messages({
            "string.empty": "Last name is required.",
            "string.max": "Last name should not be more than 25 characters."
        }),
        password  : Joi.string().min(6).required().trim().messages({
            "string.empty": "Password is required.",
            "string.min": "password should not be less than 6 characters."

        }),
        confirmPassword: Joi.string().min(6).required().trim().valid(Joi.ref('password')).messages({ "string.empty": "Confirm password is required.", 'any.only': 'Passwords do not match'}),
        username  : Joi.string().min(5).max(25).required().trim().alphanum().messages({
            "string.empty": "username is required."
        }),
    }).unknown(),
}

// Function to validate email
const emailValidation = (req)=>{
    let emailSchema = schemas.email;
    let { error, value } = emailSchema.validate(req);
    return { error, value };
};

// Function to validate complete profile
const completeValidation = (req)=>{
    let userSchema = schemas.completeData;
    let{error, value} = userSchema.validate(req);

    return {error, value}
}

// Function to validate username
const usernameValidation = (req)=>{
    let usernameSchema = schemas.username;
    let { error, value } = usernameSchema.validate(req);
    return { error, value };
};

module.exports = {
    emailValidation,
    completeValidation,
    usernameValidation
}