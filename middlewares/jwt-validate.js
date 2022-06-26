const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Logger = require('../helpers/logger');

const validateJWT = (req = request, res = response, next) => {
    const token = req.header('g-token');

    // Check if the token is sended on the header request
    if (!token) {
        return res.status(401).json({
            errors: [
                {
                    msg: 'You are not authenticated',
                    param: 'token',
                    location: 'header',
                },
            ],
        });
    }

    // If there are a token, check if is valid
    try {
        const { uid } = jwt.verify(token, process.env.PRIVATE_JWT_KEY);
        // if not fails, the token is good and the uid is saved on the request
        req.authUserID = uid;
        next();
    } catch (err) {
        Logger.error(err);

        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Your token was exired, please, relogin',
                        param: 'token',
                        location: 'header',
                    },
                ],
            });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Your token is not valid',
                        param: 'token',
                        location: 'header',
                    },
                ],
            });
        } else {
            return res.status(500).json({
                errors: ['Something went wrong, please contact de admin'],
            });
        }
    }
};

module.exports = {
    validateJWT,
};
