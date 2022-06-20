// jwt authentication middleware
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const Exception = require("./../utils/Exception")
// jwt to protected api
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (payload, done) => {
            try {
                console.log('payload', payload);
                const user = await User.findById(payload.id);
                if (!user) {
                    done(new Exception("Invalid username", 401), false);
                }
                done(null, user);
            } catch (err) {
                done(err, false);
            }
        }
    )
);
// middleware to authentication username, password 
passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username }).select('+password');
                if (!user) {
                    return done(new Exception("Invalid username", 401), false);
                }
                const isValid = await user.correctPassword(password, user.password);
                if (!isValid) {
                    done(new Exception("Invalid password", 401), false);
                }
               
                done(null, user);
            } catch (err) {
                done(err, false);
            }
        }
    )
);
