const bcryptjs = require('bcryptjs');

const encrypt = (password = '') => {
    const salt = bcryptjs.genSaltSync();
    encryptedPassword = bcryptjs.hashSync(password, salt);

    return encryptedPassword;
};

const check = (inputPassword = '', userPassword = '') => {
    return !!bcryptjs.compareSync(inputPassword, userPassword);
};

module.exports = {
    encrypt,
    check,
};
