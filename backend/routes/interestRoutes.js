import express from 'express';

const router = express.Router();

const interests = [
  'Art',
  'Books',
  'Cooking',
  'Dancing',
  'Exercise',
  'Fashion',
  'Gaming',
  'Hiking',
  'Internet Culture',
  'Jazz',
  'Knitting',
  'Languages',
  'Movies',
  'Music',
  'Nature',
  'Photography',
  'Programming',
  'Reading',
  'Sports',
  'Technology',
  'Tennis',
  'Travel',
  'Writing',
  'Yoga',
];

router.get('/interests', (req, res) => {
  try {
    res.json(interests);
  } catch (error) {
    console.error('Error serving interests:', error);
    res.status(500).json({ message: 'Error fetching interests' });
  }
});

export default router;
