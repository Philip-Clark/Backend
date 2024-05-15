const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const Grid = require('gridfs-stream');

const errorHandler = (error) => {
  console.log(error);
};

const uploadImageUtil = async (data, filename, req) => {
  if (!data) {
    return {
      error: 'Please include SVG',
    };
  }
  if (!filename) {
    return {
      error: 'Please include a filename',
    };
  }
  if (!fs.existsSync('ordered_signs')) {
    fs.mkdirSync('ordered_signs');
  }
  const uuid = uuidv4();
  const file = fs.createWriteStream(`ordered_signs/${filename}(${uuid}).svg`);
  console.log(req);
  file.write(data);
  file.end();

  return {
    message: 'Image Uploaded',
    url: `${process.env.BASE_URL}/api/ordered_signs/${filename}-(${uuid}).svg`,
  };
};

module.exports = { uploadImageUtil };
