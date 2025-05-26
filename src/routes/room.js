const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/create', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.get('/', roomController.getAllRooms);
router.put('/:id/participants', roomController.updateParticipants);
router.put('/:roomId/creator', roomController.updateCreatedBy);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
