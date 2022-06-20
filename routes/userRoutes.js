const fs = require('fs');
const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require('./../controllers/userController');
const authController = require('./../controllers/authController');
var passport = require('passport');
const auth = require("./../middlewares/auth")

// just build api, so we dont need session
router.post("/signup", authController.signup)
router.post('/login', passport.authenticate('local', {session: false}), authController.login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
