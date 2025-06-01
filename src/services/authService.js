const { admin, db } = require('../configs/firebase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

async function verifyFirebaseToken(idToken) {
  // Xác thực token với Firebase
  const decoded = await admin.auth().verifyIdToken(idToken);
  return decoded;
}

function generateTokens(user) {
  const payload = {
    uid: user.uid,
    displayName: user.displayName,
    provider: user.provider,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
}

async function findOrCreateUser(decodedToken) {
  const userRef = db.collection('users').doc(decodedToken.uid);
  const userSnap = await userRef.get();

  const userData = {
    uid: decodedToken.uid,
    displayName: decodedToken.name || '',
    email: decodedToken.email || '',
    photoURL: decodedToken.picture || '',
    provider: decodedToken.firebase?.sign_in_provider || '',
    updatedAt: new Date()
  };

  if (!userSnap.exists) {
    userData.createdAt = new Date();
    await userRef.set(userData);
  } else {
    await userRef.update(userData);
  }

  // Lấy lại dữ liệu user mới nhất
  const userDoc = await userRef.get();
  return userDoc.data();
}

module.exports = { verifyFirebaseToken, findOrCreateUser, generateTokens };
