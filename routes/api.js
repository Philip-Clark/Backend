const { createCart } = require('../controllers/checkoutController.js');
const express = require('express');
const { uploadImage } = require('../controllers/imageUploadController.js');
const router = express.Router();

router.post('/checkout', createCart);

router.post('/image', uploadImage);

module.exports = router;
