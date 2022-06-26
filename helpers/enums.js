function getValues() {
    const values = [];
    for (k in this) {
        if (typeof this[k] !== 'function') {
            values.push(this[k]);
        }
    }
    return values;
}

const Role = {
    SUPER_ADMIN: 'SUPER_ADMIN_ROLE',
    ADMIN: 'ADMIN_ROLE',
    USER: 'USER_ROLE',

    ALL_VALUES: getValues,
};

const Status = {
    PENDING: 'PENDING_STATUS',
    ACTIVE: 'ACTIVE_STATUS',
    BANNED: 'BANNED_STATUS',
    DELETED: 'DELETED_STATUS',

    ALL_VALUES: getValues,
};

module.exports = {
    Role,
    Status,
};
