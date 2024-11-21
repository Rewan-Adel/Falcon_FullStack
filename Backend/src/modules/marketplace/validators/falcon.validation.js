const joi = require('joi');


const FalconValidation = (req)=>{
    const FalconSchema = joi.object({
        name : joi.string().required().messages({
            "string.empty" : "Name is required"
        }),
        description : joi.string().required().messages({
            "string.empty" : "Description is required"
        }),
        category : joi.string().required().messages({
            "string.empty" : "Category is required"
        }),
        price : joi.number().required().messages({
            "number.base" : "Price must be a number",
            "number.empty" : "Price is required"
        }),
        state : joi.string().required().messages({
            "string.empty" : "State is required"
        }),
        city: joi.string().required().messages({
            "string.empty" : "City is required"
        }),
        color: joi.string().required().messages({
            "string.empty" : "Color is required"
        }),
        conditionOfUse : joi.string()
        .required()
        .valid('New', "Used", "Light Used","Like New")
        .trim()
        .messages({
            "string.empty" : "Condition is required", 
            "any.only" : "Condition must be either New, Used, Light Used or Like New"
        }),
    
        communicationMethod : joi.string()
        .required()
        .valid("Chat","Mobile phone", "Both")
        .trim()
        .messages({
            "string.empty" : "Condition is required", 
            "any.only" : "Condition must be either Chat, Mobile phone or Both"
        }),
    
    }).unknown();

    const {value, error} = FalconSchema.validate(req)
    return  {value, error};

}  

const updateFalconValidation = (req)=>{

    const FalconSchema = joi.object({
        conditionOfUse : joi.string()
        .valid('New', "Used", "Light Used","Like New")
        .trim()
        .messages({
            "any.only" : "Condition must be either New, Used, Light Used or Like New"
        }),
    
        communicationMethod : joi.string()
        .valid("Chat","Mobile phone", "Both")
        .trim()
        .messages({
            "any.only" : "Condition must be either Chat, Mobile phone or Both"
        }),
    
    }).unknown();

    const {value, error} = FalconSchema.validate(req)
    return  {value, error};

}  

module.exports = {
    FalconValidation,
    updateFalconValidation
};