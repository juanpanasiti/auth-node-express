const User = require('../models/user');
const { getUserByFieldsFilter } = require('../services/users.services');
const Logger = require('./logger');

const emailExists = async (email = '') => {
    const user = await getUserByFieldsFilter({ email });
    if (user) {
        throw new Error(`The email ${email} is already taken!`);
    }
};

const usernameExists = async (username = '') => {
    const user = await getUserByFieldsFilter({ username });
    if (user) {
        throw new Error(`The username ${username} is already taken!`);
    }
};

module.exports = {
    emailExists,
    usernameExists,
};
