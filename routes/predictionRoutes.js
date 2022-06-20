const express = require('express');
const { upload, uploadImage, predict } = require('./../controllers/predictionController');
const router = express.Router();

router.post('/upload', uploadImage, predict);

module.exports = router;