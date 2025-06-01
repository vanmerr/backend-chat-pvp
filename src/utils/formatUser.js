const { getUserById } = require('../services/userService');

function formatUser(user, fallbackId = '') {
  return {
    uid: user?.uid || fallbackId,
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
  };
}

async function enrichParticipants(participantUids = []) {
  const users = await Promise.all(
    participantUids.map((uid) => getUserById(uid))
  );
  return users.map((user) =>
    formatUser(user, user.uid)
  );
}


module.exports = { enrichParticipants };