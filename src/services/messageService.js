const { db } = require('../configs/firebase');

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
  return { id: messageRef.id, ...message};
}

async function getMessages(roomId, limit = 50) {
  const snapshot = await db
    .collection('rooms')
    .doc(roomId)
    .collection('messages')
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map(doc => doc.data());
}

module.exports = { sendMessage, getMessages }; 