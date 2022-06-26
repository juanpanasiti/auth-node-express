const { response, request } = require('express');
const userServices = require('../services/users.services');
// const User = require('../models/user');
const { Status } = require('../helpers/enums');
const { wrongUserPassword } = require('../constants/error-messages');
const Logger = require('../helpers/logger');
const { generateJWT } = require('../helpers/jwt');
const { check } = require('../helpers/password');

const signup = async (req = request, res = response) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await userServices.createUser({ username, email, password });
        res.status(201).json({
            response_data: newUser,
            errors: [],
        });
    } catch (err) {
        res.status(400).json({
            errors: [err],
        });
    }
};

const signin = async (req = request, res = response) => {
    const { email, username, password } = req.body;
    try {
        let user = null;

        // check if user exists on DB
        if (email) {
            // user = await User.findOne({ email });
            user = await userServices.getUserByFieldsFilter({ email });
        } else {
            // user = await User.findOne({ username });
            user = await userServices.getUserByFieldsFilter({ username });
        }
        if (!user || user.status === Status.BANNED || user.status === Status.DELETED) {
            return res.status(400).json(wrongUserPassword);
        }

        // check password
        if (!check(password, user.password)) {
            return res.status(400).json(wrongUserPassword);
        }

        // generate JWT
        const jwt = await generateJWT(user.id);

        return res.json({
            response_data: {
                user,
                token: jwt,
            },
            errors: [],
        });
    } catch (err) {
        Logger.error(err);
    }
};

const renewJWT = async(req = request, res = response) => {
    const jwt = await generateJWT(req.authUserID)
    return res.status(200).json({response_data: jwt});
};

module.exports = {
    signup,
    signin,
    renewJWT,
};
