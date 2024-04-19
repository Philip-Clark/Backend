const express = require('express');
const { uploadImageUtil } = require('../utils/uploadImageUtil');
const router = express.Router();

exports.uploadImage = async (req, res) => {
  console.log('req.body', req.body);
  const { combinedSVG, filename } = req.body;
  if (!combinedSVG) {
    res.status(400).json({ message: 'Please include SVG' });
    return;
  }
  if (!filename) {
    res.status(400).json({ message: 'Please include a filename' });
    return;
  }
  const response = await uploadImageUtil(combinedSVG, filename);
  console.log('url', response.url);
  res.json({ url: response.url, message: 'Image Uploaded' });
};
