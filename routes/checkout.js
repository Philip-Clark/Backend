const { createCart } = require('../controllers/checkoutController.js');
const express = require('express');
const router = express.Router();

router.get('/checkout', createCart);

module.exports = router;
