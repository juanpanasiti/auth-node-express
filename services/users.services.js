const bcryptjs = require('bcryptjs');
const { defaultPaging } = require('../constants/default-values');
const { Status } = require('../helpers/enums');

const Logger = require('../helpers/logger');
const User = require('../models/user');

const getUserById = async (uid = '', fields = null) => {
    try {
        const user = await User.findOne({ _id: uid, status: Status.ACTIVE }, fields);
        return user;
    } catch (err) {
        Logger.error(err);
        throw new Error(err);
    }
};

const getAllPaginated = async (paging = defaultPaging) => {
    const { skip, limit } = paging;
    const query = {
        $or: [
            {
                status: Status.ACTIVE,
            },
            {
                status: Status.PENDING,
            },
        ],
    };

    return await Promise.all([User.find(query).skip(skip).limit(limit), User.countDocuments(query)]);
};

const getUserByFieldsFilter = async (filter = {}) => {
    try {
        const user = await User.findOne(filter);
        return user;
    } catch (err) {
        Logger.error(err);
        throw new Error(err);
    }
};

const createUser = async (fields = {}) => {
    try {
        const user = new User(fields);

        // Ecrypt password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(fields.password, salt);

        // Save
        await user.save();

        return user;
    } catch (err) {
        Logger.error(err);
        throw new Error(err);
    }
};

const checkPassword = (password, user) => {
    const isOk = bcryptjs.compareSync(password, user?.password || '');
    if (isOk) {
        return true;
    }
    return false;
};

module.exports = {
    getUserByFieldsFilter,
    createUser,
    checkPassword,
    getUserById,
    getAllPaginated,
};
