const { verifyFirebaseToken, findOrCreateUser, generateTokens } = require('../services/authService');

exports.loginWithFirebase = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

  try {
    const decoded = await verifyFirebaseToken(idToken);
    const user = await findOrCreateUser(decoded);
    const tokens = generateTokens(user);
    res.json({
      user: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: user.provider,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token', details: err.message });
    console.error('Error verifying Firebase token:', err);
  }
};
