const { validationResult } = require('express-validator');
const user = require('../models/user');
const bycrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error("Validation failed, entered data is incorrect.");
            error.statusCode = 422;
            throw error;
        }
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const encryptedPassword = await bycrypt.hash(password, 12);
        if (encryptedPassword) {
            const addUserToDatabase = await new user({ name: name, email: email, password: encryptedPassword }).save();
            if (addUserToDatabase) return res.json({ message: "User created successfully", user: addUserToDatabase })
        }

    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const getUser = await user.findOne({ email: req.body.email });
        if (!getUser) {
            const error = new Error("User not found!");
            error.statusCode = 500;
            throw error;
        }
        const comparePassword = await bycrypt.compare(req.body.password, getUser.password);
        if (!comparePassword) {
            const error = new Error("Invalid password!");
            error.statusCode = 500;
            throw error;

        } else return res.json({ message: "login success", user: getUser });
    } catch (err) {
        next(err);
    }
};