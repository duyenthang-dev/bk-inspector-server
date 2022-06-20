const express = require('express');
const cors = require('cors')
const app = express();
const userRouter = require('./routes/userRoutes');
const predictionRouter = require('./routes/predictionRoutes');

const Exception = require('./utils/Exception');
const passport = require('passport');

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/api/v1/users', userRouter);
app.use('/predict', predictionRouter);
app.use(express.static(`${__dirname}/public`));

app.all('*', (req, res, next) => {
    next(new Exception(`Cant find ${req.originalUrl} on this server!`, 404));
});

// middleware that handling error
app.use((err, req, res, next) => {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

module.exports = app;
