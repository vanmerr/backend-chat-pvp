const {
  createRoom,
  getRoomById,
  getAllRooms,
  updateParticipants,
  updateCreatedBy,
  deleteRoom,
} = require("../services/roomService");
const bcrypt = require("bcrypt");

exports.createRoom = async (req, res) => {
  try {
    const {
      name,
      description = "",
      isPrivate = false,
      createdBy,
      password = "",
    } = req.body;
    if (!name || !createdBy)
      return res.status(400).json({ error: "Missing name or createdBy" });
    let hashedPassword = "";
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const room = await createRoom({
      name,
      description,
      isPrivate,
      createdBy,
      password: hashedPassword,
    });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await getRoomById(id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, action = "add" } = req.body;

    const updatedParticipants = await updateParticipants(id, userId, action);
    res.json({ participants: updatedParticipants });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCreatedBy = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { newCreatorId } = req.body;

    await updateCreatedBy(roomId, newCreatorId);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    await deleteRoom(id, userId);
    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
