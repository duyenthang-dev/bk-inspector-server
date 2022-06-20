const User = require('./../models/User');
const Exception = require('./../utils/Exception');
const jwt = require('jsonwebtoken');
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};


exports.signup = async (req, res, next) => {
    try {
        // only allow 4 field we need
        const newUser = await User.create({
            name: req.body.name,
            age: req.body.age,
            username: req.body.username,
            password: req.body.password,
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        console.log(err.name)
        if (err?.code === 11000)
            next(new Exception("Username already exists", 400))
        else if (err?.name === "ValidationError"){
            next(new Exception("Missing fields", 400))
        }
    }
};

exports.login = async (req, res) => {
    try {
        // gen token back to user
        const token = signToken(req.user.id);
        res.setHeader("Authorization", token)
        res.status(200).json({
            status: 'success',
            token,
        });
    } catch (err) {
        return next(new Exception('Server error: ' + err.message, 500));
    }
};
