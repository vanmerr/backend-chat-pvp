const { verifyFirebaseToken, findOrCreateUser } = require('../services/authService');

exports.loginWithFirebase = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

  try {
    const decoded = await verifyFirebaseToken(idToken);
    const user = await findOrCreateUser(decoded);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
};
