const jwt = require('jsonwebtoken');
const Logger = require('./logger');

const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.PRIVATE_JWT_KEY,
            {
                expiresIn: '12h',
            },
            (err, token) => {
                if (err) {
                    Logger.error(err);
                    reject(`Something went wrong with the token generation (${err}).`);
                } else {
                    resolve(token);
                }
            }
        );
    });
};

module.exports = {
    generateJWT
}