const { Router } = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users.controller');
const { checkPermissionAndExistence } = require('../helpers/db-validators');
const { Role } = require('../helpers/enums');
const { fieldValidate } = require('../middlewares/fields-middlewares');
const { validateJWT } = require('../middlewares/jwt-validate');
const { hasRole } = require('../middlewares/role-validate');

const router = Router();

router.get(
    '/:id',
    [validateJWT, check('id', "It isn't a valid uid.").isMongoId(), fieldValidate, checkPermissionAndExistence],
    usersControllers.getUserById
);

router.get('/', [validateJWT, hasRole([Role.ADMIN, Role.SUPER_ADMIN]), fieldValidate], usersControllers.getUsers);

router.delete('/:id', [validateJWT, hasRole([Role.SUPER_ADMIN]) ,fieldValidate], usersControllers.deleteUser);

module.exports = router;