import User from '../models/User.js';
import GeneratedContent from '../models/GeneratedContent.js';

export const getStats = async (req, res) => {
  try {
    const [total, bookmarked, byPaper] = await Promise.all([
      GeneratedContent.countDocuments({ userId: req.user.id }),
      GeneratedContent.countDocuments({ userId: req.user.id, isBookmarked: true }),
      GeneratedContent.aggregate([
        { $match: { userId: req.user.id } },
        { $group: { _id: '$gsPaper', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const recentTopics = await GeneratedContent.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('topic gsPaper createdAt');

    res.json({ total, bookmarked, byPaper, recentTopics });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: req.body },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};
