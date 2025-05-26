const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { uploadMultipleImages } = require('../middlewares/upload');

// Allow up to 10 files to be uploaded
router.post('/:roomId', uploadMultipleImages, messageController.sendMessage);
router.get('/:roomId', messageController.getMessages);

module.exports = router; 