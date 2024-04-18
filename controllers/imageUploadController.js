const express = require('express');
const { uploadImageUtil } = require('../utils/uploadImageUtil');
const router = express.Router();

exports.uploadImage = async (req, res) => {
  console.log('req.body', req.body);
  const { foregroundString, backgroundString } = req.body;
  if (!foregroundString || !backgroundString) {
    res.status(400).json({ message: 'Please include Foreground and Background SVGs' });
    return;
  }
  const uploadFE = uploadImageUtil(foregroundString);
  const uploadBE = uploadImageUtil(backgroundString);

  const [foregroundResponse, backgroundResponse] = await Promise.all([uploadFE, uploadBE]);

  console.log(foregroundResponse, backgroundResponse);
  res.json({ foregroundResponse, backgroundResponse, message: 'Images Uploaded' });
};
