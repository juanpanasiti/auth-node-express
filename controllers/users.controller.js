const { response, request } = require('express');
const { Status, Role } = require('../helpers/enums');
const Logger = require('../helpers/logger');

const userServices = require('../services/users.services');

const getUserById = async (req = request, res = response) => {
    try {
        const user = await userServices.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({
                errors: [`There's no user with id "${req.params.id}"`],
            });
        }
        return res.status(200).json({
            response_data: user,
            errors: [],
        });
    } catch (err) {
        Logger.error(`UsersController.getUserById -> ${err}`);
        return res.status(500).json({
            errors: ['Something went wrong, please contact de admin'],
        });
    }
};

const getUsers = async (req = request, res = response) => {
    const { skip = 0, limit = 10 } = req.query;

    try {
        const [users, total] = await userServices.getAllPaginated({ skip, limit });
        res.status(200).json({
            response_data: {
                users,
                total,
            },
            errors: [],
        });
    } catch (err) {
        Logger.error(err);
        res.status(500).json({
            errors: [err],
        });
    }
};

const updateUser = async (req = request, res = response) => {
    const uid = req.params.id;
    const authRole = req.authUserRole;
    const { email, username, role, status, password } = req.body;

    const filter = {
        _id: uid,
        $or: [
            {
                status: Status.ACTIVE,
            },
            {
                status: Status.PENDING,
            },
            {
                status: Status.BANNED,
            },
        ],
    };
    const data = {};

    if (password) {
        data.password = password;
    }

    if (authRole === Role.USER && uid !== req.authUserID) {
        return res.status(403).json({
            errors: [
                {
                    msg: 'You do not have permission to edit this user',
                },
            ],
        });
    }

    if (authRole === Role.ADMIN && Status.BANNED === status) {
        data.status = status;
    }

    if (authRole === Role.SUPER_ADMIN) {
        data.role = role;
        data.email = email;
        data.username = username;
    }

    // Control data
    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            errors: [
                {
                    msg: 'There are nothing to edit',
                    location: 'body',
                },
            ],
        });
    }

    try {
        const updatedUser = await userServices.updateUser(filter, data);

        res.status(200).json({
            response_data: updatedUser,
            errors: [],
        });
    } catch (err) {
        Logger.error(err);
        res.status(500).json({
            errors: [err],
        });
    }
};

const deleteUser = async (req = request, res = response) => {
    const uid = req.params.id;
    const deleteUser = !req.query.undelete;

    const filter = {
        _id: uid,
    };

    const data = {
        status: deleteUser ? Status.DELETED : Status.ACTIVE,
    };

    try {
        const { status } = await userServices.updateUser(filter, data);

        res.status(200).json({
            response_data: {
                status: status,
            },
            errors: [],
        });
    } catch (err) {
        Logger.error(err);
        res.status(500).json({
            errors: [err],
        });
    }
};

module.exports = {
    getUserById,
    getUsers,
    updateUser,
    deleteUser,
};
