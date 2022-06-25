const { response, request } = require('express');
const Logger = require('../helpers/logger');

const userServices = require('../services/users.services');

const hasRole = (allowed_roles = []) => {
    return async (req = request, res = response, next) => {
        const uid = req.authUserID;
        if (!uid) {
            res.status(500).json({
                errors: [{ msg: 'Token not validated previusly, this is a server error commited by the developer' }],
            });
        }

        try {
            const { role } = await userServices.getUserById(uid, ['role']);

            if (!allowed_roles.includes(role)) {
                return res.status(403).json({
                    errors: [
                        {
                            msg: `You have no enough range! Sorry!`,
                        },
                    ],
                });
            }
            req.authUserRole = role

            next();
        } catch (err) {
            Logger.error(err);
            res.status(500).json({
                errors: [
                    {
                        msg: `Something went wrong! contact the admin!`,
                    },
                ],
            });
        }
    };
};

module.exports = {
    hasRole,
};
