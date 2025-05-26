const { db } = require('../configs/firebase');
const { enrichParticipants } = require('../utils/formatUser');



async function createRoom({ name, description = '', isPrivate = false, createdBy, password = '' }) {
  const now = new Date();
  const roomData = {
    name,
    description,
    isPrivate,
    password,
    createdAt: now,
    createdBy,
    participants: [createdBy],
  };

  const [roomRef, participants] = await Promise.all([
    db.collection('rooms').add(roomData),
    enrichParticipants(roomData.participants),
  ]);

  return {
    id: roomRef.id,
    ...roomData,
    participants,
  };
}

async function getRoomById(roomId) {
  const roomDoc = await db.collection('rooms').doc(roomId).get();
  if (!roomDoc.exists) return null;

  const data = roomDoc.data();
  const participants = await enrichParticipants(data.participants || []);

  return { id: roomDoc.id, ...data, participants };
}

async function getAllRooms() {
  const snapshot = await db.collection('rooms').get();

  return Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const participants = await enrichParticipants(data.participants || []);
      return { id: doc.id, ...data, participants };
    })
  );
}

async function updateParticipants(roomId, userId, action = 'add') {
  const roomRef = db.collection('rooms').doc(roomId);
  const roomDoc = await roomRef.get();

  if (!roomDoc.exists) {
    throw new Error('Room not found');
  }

  const roomData = roomDoc.data();
  let participants = roomData.participants || [];

  if (action === 'add') {
    if (!participants.includes(userId)) {
      participants.push(userId);
    }
  } else if (action === 'remove') {
    participants = participants.filter((uid) => uid !== userId);
  } else {
    throw new Error('Invalid action. Must be "add" or "remove".');
  }

  await roomRef.update({ participants });
  const updatedParticipants = await enrichParticipants(participants);

  return updatedParticipants;
}

async function updateCreatedBy(roomId, newCreatorId) {
  const roomRef = db.collection('rooms').doc(roomId);
  const roomDoc = await roomRef.get();

  if (!roomDoc.exists) {
    throw new Error('Room not found');
  }

  await roomRef.update({ createdBy: newCreatorId });
  return true;
}


async function deleteRoom(roomId, userId) {
  const roomRef = db.collection('rooms').doc(roomId);
  const roomDoc = await roomRef.get();

  if (!roomDoc.exists) throw new Error('Room not found');
  if (roomDoc.data().createdBy !== userId) throw new Error('Only the creator can delete this room');

  await roomRef.delete();
  return true;
}

module.exports = {
  createRoom,
  getRoomById,
  getAllRooms,
  deleteRoom,
  updateParticipants,
  updateCreatedBy,
};
