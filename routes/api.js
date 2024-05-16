const { createCart } = require('../controllers/checkoutController.js');
const express = require('express');
const { uploadImage } = require('../controllers/imageUploadController.js');
const { getProductData } = require('../controllers/productController.js');
const path = require('path');
const router = express.Router();

router.post('/checkout', createCart);

router.post('/image', uploadImage);

router.get('/data', getProductData);
router.get('/ordered_signs/:name', (req, res) => {
  console.log(path.join(__dirname, `../ordered_signs/${req.params.name}`));
  const sanitizedFileName = req.params.name.replace(/\([^()]*\)/g, '');
  res.download(path.join(__dirname, `../ordered_signs/${sanitizedFileName}`));
});

module.exports = router;
