const { db } = require('../configs/firebase');
const { enrichUser } = require('../utils/formatUser');

async function sendMessage(roomId, { text = "", sender, files = [] }) {
  const messageData = {
    text,
    sender, 
    files,
    timestamp: new Date()
  };
  const messageRef = await db.collection('rooms').doc(roomId).collection('messages').add(messageData);
  const messageDoc = await messageRef.get();
  const message = messageDoc.data();  
  const enrichedSender = await enrichUser(message.sender); // Use enrichUser
  return { id: messageRef.id, ...message, sender: enrichedSender };
}

async function getMessages(roomId, limit = 50) {
  const snapshot = await db
    .collection('rooms')
    .doc(roomId)
    .collection('messages')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();

  const messages = await Promise.all(snapshot.docs.map(async doc => {
    const messageData = doc.data();
    const enrichedSender = await enrichUser(messageData.sender); // Use enrichUser

    return {
      id: doc.id,
      ...messageData,
      sender: enrichedSender // Replace sender with enriched user object
    };
  }));

  return messages.reverse();
}

module.exports = { sendMessage, getMessages }; 