const { response, request } = require('express');
const Logger = require('../helpers/logger');

const filterValidFields = (allowed_fields = []) => {
    return (req = request, res = response, next) => {
        const body = {}
        for ( field in req.body){
            if (allowed_fields.includes(field)){
                body[field] = req.body[field]
            }
        }
        next()
    }
}

module.exports = {
    filterValidFields,
};
