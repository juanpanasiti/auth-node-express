const { Schema, model } = require('mongoose');
const { Status, Role } = require('../helpers/enums');

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'The email is mandatory.'],
        unique: true,
    },
    username: {
        type: String,
        required: [true, 'The username is mandatory.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'The email is mandatory.'],
    },
    img: {
        type: String,
        defualt: null
    },
    role: {
        type: String,
        required: true,
        default: Role.USER,
        enum: Role.ALL_VALUES(),
    },
    status: {
        type: String,
        default: Status.ACTIVE, // ? Must be 'pending'?
        enum: Status.ALL_VALUES(),
    },
    google: {
        type: Boolean,
        default: false
    },
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};

module.exports = model('User', UserSchema)
