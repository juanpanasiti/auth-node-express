const { Router } = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth.controller');
const { emailExists, usernameExists } = require('../helpers/db-validators');
const { fieldValidate, filterValidFields, atLeastOneExists } = require('../middlewares/fields-middlewares');
const { validateJWT } = require('../middlewares/jwt-validate');
// const { fieldValidate } = require('../middlewares/field-validate');
// const { filterValidFields } = require('../middlewares/filter-fields');

const router = Router();

router.post(
    '/signup',
    [
        check('password', 'Password is mandatory and must have 8 chars min.').isLength({ min: 8 }),
        check('email', 'The email is invalid').isEmail(),
        check('username', 'The username must have between 8 and 16 characters.').isLength({ min: 8, max: 16 }),
        check('email').custom(emailExists),
        check('username').custom(usernameExists),
        fieldValidate,
        filterValidFields(['username', 'password', 'email']),
    ],
    authController.signup
);

router.post(
    '/signin',
    [
        atLeastOneExists(['username', 'email']),
        check('email', 'The email is invalid')
            .if((value, { req }) => req.body.email)
            .isEmail(),
        check('password', 'Password is mandatory').not().isEmpty(),
        fieldValidate,
    ],
    authController.signin
);

router.get('/renew-token', [validateJWT], authController.renewJWT);

module.exports = router;
