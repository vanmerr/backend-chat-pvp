const { format } = require('date-fns');
const { storage } = require('../configs/firebase');
const path = require('path');

const uploadFiles = async (files) => {
  const uploadPromises = files.map((file) => {
    const timestamp = format(new Date(), 'yyyyMMddHHmmssSSS');
    const extension = path.extname(file.originalname);
    const newFileName = `${timestamp}${extension}`;
    const destination = `uploads/${newFileName}`;

    return storage.upload(file.path, {
      destination,
      public: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    })
    .then(() => `https://storage.googleapis.com/${storage.name}/${destination}`)
    .catch((err) => {
      throw new Error(`Failed to upload file: ${file.originalname}. Error: ${err.message}`);
    });
  });

  try {
    const fileUrls = await Promise.all(uploadPromises);
    return fileUrls;
  } catch (err) {
    throw new Error('Error during file upload');
  }
};

module.exports = { uploadFiles };
