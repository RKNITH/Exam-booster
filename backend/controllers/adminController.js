import User from '../models/User.js';
import GeneratedContent from '../models/GeneratedContent.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalContent, contentByPaper] = await Promise.all([
      User.countDocuments(),
      GeneratedContent.countDocuments(),
      GeneratedContent.aggregate([
        { $group: { _id: '$gsPaper', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({ totalUsers, totalContent, contentByPaper });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
