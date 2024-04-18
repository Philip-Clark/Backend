const { uploadImageUtil } = require('../utils/uploadImageUtil');
const dotenv = require('dotenv');
dotenv.config();

const { data } = require('../data');
describe('uploadImage', () => {
  it('should upload an image successfully', () => {
    uploadImageUtil(data).then((response) => {
      expect(response).toEqual({ message: 'Image uploaded' });
    });
  });
});
