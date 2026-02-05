const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const uploadBuffer = (buffer, folder, resourceType = 'image') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

module.exports = uploadBuffer;
