const { validationResult } = require('express-validator');
const user = require('../models/user');

exports.signup = async (req, res, next) => {
    try {
        if (!errors.isEmpty()) {
            const err = { errors: errors.array(), message: "Validation failed, entered data is incorrect.", statusCode: 422 };
            next(err);
        }
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
    } catch (err) {
        next(err);
    }
};