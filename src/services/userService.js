const { db } = require('../configs/firebase');

async function getUserById(uid) {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();
  if (!userDoc.exists) return null;
  return { id: userDoc.id, ...userDoc.data() };
}

module.exports = { getUserById }; 