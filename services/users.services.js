const { defaultPaging } = require('../constants/default-values');
const { Status } = require('../helpers/enums');

const Logger = require('../helpers/logger');
const { encrypt } = require('../helpers/password');
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
        // const salt = bcryptjs.genSaltSync();
        // user.password = bcryptjs.hashSync(fields.password, salt);
        user.password = encrypt(fields.password);

        // Save
        await user.save();

        return user;
    } catch (err) {
        Logger.error(err);
        throw new Error(err);
    }
};

const updateUser = async (filter, newData) => {
    const { password, ...payload } = newData;
    if (password) {
        payload.password = encrypt(password);
    }
    try {
        const updatedUser = await User.findOneAndUpdate(filter, payload, { new: true });
        if (!updatedUser) {
            throw new Error(`The user #${uid} doesn't exist`)
        }
        return updatedUser
    } catch (err) {
        Logger.error(err);
        throw new Error(err);
    }
};

module.exports = {
    getUserByFieldsFilter,
    createUser,
    getUserById,
    getAllPaginated,
    updateUser,
};
