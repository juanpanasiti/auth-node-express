const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const userServices = require('../services/users.services');
const { Role } = require('./enums');
const Logger = require('./logger');

const emailExists = async (email = '') => {
    const user = await userServices.getUserByFieldsFilter({ email });
    if (user) {
        throw new Error(`The email ${email} is already taken!`);
    }
};

const usernameExists = async (username = '') => {
    const user = await userServices.getUserByFieldsFilter({ username });
    if (user) {
        throw new Error(`The username ${username} is already taken!`);
    }
};

const checkPermissionAndExistence = async (req = request, res = response, next) => {
    const reqUID = req.params.id;

    const loggedUID = req.authUserID;
        if (!loggedUID) {
            res.status(500).json({
                errors: [{ msg: 'Token not validated previusly, this is a server error commited by the developer' }],
            });
        }

    try {
        if (loggedUID !== reqUID) {
            const { role } = await userServices.getUserById(loggedUID, ['role']);

            if (![Role.ADMIN, Role.SUPER_ADMIN].includes(role)) {
                return res.status(403).json({
                    errors: [
                        {
                            msg: 'You are not authorized to get the requested info.',
                        },
                    ],
                });
            }
        }
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
        } else {
            return res.status(500).json({
                errors:['Something went wrong, please contact de admin']
            })
        }
        
    } finally{
        next();
    }

};

module.exports = {
    emailExists,
    usernameExists,
    checkPermissionAndExistence,
};
