const { createCart } = require('../controllers/checkoutController.js');
const express = require('express');
const { uploadImage } = require('../controllers/imageUploadController.js');
const { getProductData } = require('../controllers/productController.js');
const router = express.Router();

router.post('/checkout', createCart);

router.post('/image', uploadImage);

router.get('/data', getProductData);

module.exports = router;
