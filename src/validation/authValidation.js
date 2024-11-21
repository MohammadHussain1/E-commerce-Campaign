const Joi = require('joi');

// Validation schema for user registration
const registerUserValidation = {
    body: Joi.object({
        username: Joi.string().max(30).required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().email().required()
    })
};

const loginUserValidation = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
};


module.exports = {
    registerUserValidation,
    loginUserValidation
};
