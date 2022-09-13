const express = require('express');
const { body } = require('express-validator');

const user = require('../models/user');
const authController = require('../controllers/auth')

const router = express.Router();

router.put('/signup', [body('email').trim().isEmail().withMessage("Please enter a valid email").custom(value => {
    return user.findOne({ email: value }).then(user => Promise.reject("Email address already exists!"))
}).normalizeEmail(), body('password').trim().not().isEmpty()], authController.signup);

module.exports = router;