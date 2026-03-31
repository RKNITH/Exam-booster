import GeneratedContent from '../models/GeneratedContent.js';

export const getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const [history, total] = await Promise.all([
      GeneratedContent.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('topic gsPaper theme language isBookmarked tags createdAt viewCount rating'),
      GeneratedContent.countDocuments({ userId: req.user.id }),
    ]);

    res.json({ history, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const clearHistory = async (req, res) => {
  try {
    await GeneratedContent.deleteMany({ userId: req.user.id, isBookmarked: false });
    res.json({ message: 'Non-bookmarked history cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
};
