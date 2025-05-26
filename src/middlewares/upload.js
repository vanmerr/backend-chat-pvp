const multer = require('multer');
const path = require('path');
const os = require('os');
const fs = require('fs').promises; // dùng fs.promises để async/await
const { uploadFiles } = require('../services/uploadService');

const upload = multer({
  dest: path.join(os.tmpdir(), 'uploads'),
});

// Middleware for uploading multiple images (max 5)
const uploadMultipleImages = (req, res, next) => {
  upload.array('files', 10)(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: `Upload failed: ${err.message}` });
    }

    if (!req.files || req.files.length === 0) {
      return next(); // No files to upload
    }

    try {
      const fileUrls = await uploadFiles(req.files);
      req.body.fileUrls = fileUrls;
    } catch (error) {
      console.error('File upload error:', error);
      return res.status(500).json({ error: 'Failed to upload files' });
    } finally {
      // Always clean up temp files
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error(`Failed to delete temp file ${file.path}:`, err.message);
        }
      }
    }

    next();
  });
};

module.exports = { uploadMultipleImages };
