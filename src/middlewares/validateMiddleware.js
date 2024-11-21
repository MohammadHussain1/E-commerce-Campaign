const Joi = require('joi');
const validate = (schema) => {
    return (req, res, next) => {
        const validationResults = [];

        if (schema.body) {
            const { error } = schema.body.validate(req.body, { abortEarly: false });
            if (error) {
                validationResults.push(error.details);
            }
        }

        if (schema.params) {
            const { error } = schema.params.validate(req.params, { abortEarly: false });
            if (error) {
                validationResults.push(error.details);
            }
        }

        if (schema.query) {
            const { error } = schema.query.validate(req.query, { abortEarly: false });
            if (error) {
                validationResults.push(error.details);
            }
        }

        if (validationResults.length > 0) {
            return res.status(400).json({ message: 'Validation error', details: validationResults.flat() });
        }

        next();
    };
};

module.exports = { validate };
