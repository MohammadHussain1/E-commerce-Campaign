const Joi = require('joi');

// Validation schema for user registration
const createUserValidation = {
    body: Joi.object({
        username: Joi.string().max(30).required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().email().required()
    })
};

// Validation schema for updating user details
const updateUserValidation = {
    params: Joi.object({
        id: Joi.number().integer().positive().required()
    }),
    body: Joi.object({
        username: Joi.string().max(30),
        password: Joi.string().min(6),
        email: Joi.string().email()
    })
};

// Validation schema for id parameter
const getUserByIdValidation = {
    params: Joi.object({
        id: Joi.number().integer().positive().required()
    })
};

// Validation schema for query parameters (example)
const deleteUserByIdValidation = {
    params: Joi.object({
        id: Joi.number().integer().positive().required()
    })
};

module.exports = {
    createUserValidation,
    updateUserValidation,
    getUserByIdValidation,
    deleteUserByIdValidation
};
