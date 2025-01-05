import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.userId },
    }).select('username interests');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
});

router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends');
    const friendIds = user.friends.map((friend) => friend._id);
    const notFriends = { _id: { $nin: [...friendIds, user._id] } };

    const mutualFriendRecs = await User.aggregate([
      { $match: notFriends },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$_id' },
          pipeline: [
            { $match: { _id: { $in: friendIds } } },
            {
              $lookup: {
                from: 'users',
                localField: 'friends',
                foreignField: '_id',
                as: 'mutualFriends',
              },
            },
            {
              $match: {
                $expr: {
                  $in: ['$$userId', '$mutualFriends._id'],
                },
              },
            },
          ],
          as: 'mutualConnections',
        },
      },
      {
        $addFields: {
          mutualCount: { $size: '$mutualConnections' },
        },
      },
      { $match: { mutualCount: { $gt: 0 } } },
      { $sort: { mutualCount: -1 } },
      { $limit: 2 },
      {
        $project: {
          _id: 1,
          username: 1,
          mutualCount: 1,
          recommendationType: { $literal: 'mutual' },
        },
      },
    ]);

    const interestRecs = await User.aggregate([
      { $match: notFriends },
      {
        $addFields: {
          commonInterests: {
            $setIntersection: ['$interests', user.interests],
          },
        },
      },
      {
        $addFields: {
          interestCount: { $size: '$commonInterests' },
        },
      },
      { $match: { interestCount: { $gt: 0 } } },
      { $sort: { interestCount: -1 } },
      { $limit: 2 },
      {
        $project: {
          _id: 1,
          username: 1,
          commonInterests: 1,
          interestCount: 1,
          recommendationType: { $literal: 'interest' },
        },
      },
    ]);

    let recommendations = [...mutualFriendRecs, ...interestRecs];

    if (recommendations.length < 4) {
      const existingIds = recommendations.map((rec) => rec._id);
      const remainingSlots = 4 - recommendations.length;

      const additionalUsers = await User.aggregate([
        {
          $match: {
            _id: { $nin: [...friendIds, ...existingIds, user._id] },
          },
        },
        { $sample: { size: remainingSlots } },
        {
          $project: {
            _id: 1,
            username: 1,
            recommendationType: { $literal: 'other' },
          },
        },
      ]);

      recommendations = [...recommendations, ...additionalUsers];
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error getting recommendations' });
  }
});

router.patch('/interests', auth, async (req, res) => {
  try {
    const { interests } = req.body;

    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'Interests must be an array' });
    }

    // Limit to 10 interests
    const limitedInterests = interests.slice(0, 10);

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { interests: limitedInterests } },
      { new: true }
    ).select('interests');

    res.json({ interests: user.interests });
  } catch (error) {
    res.status(500).json({ message: 'Error updating interests' });
  }
});

export default router;
