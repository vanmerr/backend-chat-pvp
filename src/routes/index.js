const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const roomRoutes = require('./room');
const messageRoutes = require('./message');

router.use('/auth', authRoutes);
router.use('/room', roomRoutes);
router.use('/message', messageRoutes);
router.get('/',
    (req, res) => {
        res.send('Hello World');
    }
)

module.exports = router;

