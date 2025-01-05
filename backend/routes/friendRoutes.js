import express from 'express';
import User from '../models/userModel.js';
import auth from '../middleware/auth.js';

const router = express.Router();

async function updateFriendList(user, friendId, action) {
  const friendIndex = user.friends.findIndex(
    (id) => id.toString() === friendId
  );
  if (action === 'add' && friendIndex === -1) {
    user.friends.push(friendId);
  } else if (action === 'remove' && friendIndex !== -1) {
    user.friends.splice(friendIndex, 1);
  }
  await user.save();
}

router.post('/request/:userId', auth, async (req, res) => {
  try {
    const [targetUser] = await Promise.all(User.findById(req.params.userId));

    if (!targetUser) return res.status(404).json({ message: 'User not found' });
    if (
      targetUser.friendRequests.some(
        (request) => request.from.toString() === req.userId
      )
    ) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    targetUser.friendRequests.push({ from: req.userId, status: 'pending' });
    await targetUser.save();
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request' });
  }
});

router.post('/respond/:requestId', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.userId);
    const request = user.friendRequests.id(req.params.requestId);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;

    if (status === 'accepted') {
      await Promise.all([
        updateFriendList(user, request.from, 'add'),
        updateFriendList(await User.findById(request.from), user._id, 'add'),
      ]);
    }

    await user.save();
    res.json({ message: `Friend request ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Error responding to friend request' });
  }
});

router.delete('/unfriend/:userId', auth, async (req, res) => {
  try {
    const [user, friend] = await Promise.all([
      User.findById(req.userId),
      User.findById(req.params.userId),
    ]);

    if (!user || !friend)
      return res.status(404).json({ message: 'User not found' });

    await Promise.all([
      updateFriendList(user, req.params.userId, 'remove'),
      updateFriendList(friend, req.userId, 'remove'),
    ]);

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing friend' });
  }
});

router.get('/list', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('friends', 'username')
      .populate('friendRequests.from', 'username');

    res.json({
      friends: user.friends.map((f) => ({ id: f._id, username: f.username })),
      requests: user.friendRequests,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting friend list' });
  }
});

export default router;
