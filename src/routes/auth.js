const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/verify-firebase-token', authController.loginWithFirebase);

module.exports = router;
