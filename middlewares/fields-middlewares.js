const { response, request } = require('express');
// atLeastOneExists

const { validationResult } = require('express-validator');

const fieldValidate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.errors,
        });
    }
    next();
};

const filterValidFields = (allowed_fields = []) => {
    return (req = request, res = response, next) => {
        const body = {};
        for (field in req.body) {
            if (allowed_fields.includes(field)) {
                body[field] = req.body[field];
            }
        }
        next();
    };
};

const atLeastOneExists = (fields = []) => {
    return (req = request, res = response, next) => {
        let atLeastOneExists = false;
        fields.forEach((field) => {
            atLeastOneExists ||= !!req.body[field];
        });
        if (!atLeastOneExists) {
            return res.status(400).json({
                errors: ['You must send at least the username or the email.'],
            });
        }
        next();
    };
};

module.exports = {
    fieldValidate,
    filterValidFields,
    atLeastOneExists,
};
