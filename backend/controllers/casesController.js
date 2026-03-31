import GeneratedContent from '../models/GeneratedContent.js';

export const getCases = async (req, res) => {
  try {
    const { gsPaper, theme, search, page = 1, limit = 10, bookmarked } = req.query;
    const query = { userId: req.user.id };

    if (gsPaper && gsPaper !== 'all') query.gsPaper = gsPaper;
    if (theme) query.theme = theme;
    if (bookmarked === 'true') query.isBookmarked = true;
    if (req.query.language && req.query.language !== 'all') query.language = req.query.language;
    if (search) {
      query.$or = [
        { topic: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await GeneratedContent.countDocuments(query);
    const cases = await GeneratedContent.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('topic gsPaper theme language keywords isBookmarked tags createdAt');

    res.json({ cases, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const content = await GeneratedContent.findOne({ _id: req.params.id, userId: req.user.id });
    if (!content) return res.status(404).json({ error: 'Content not found' });

    content.viewCount += 1;
    await content.save();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const content = await GeneratedContent.findOne({ _id: req.params.id, userId: req.user.id });
    if (!content) return res.status(404).json({ error: 'Content not found' });

    content.isBookmarked = !content.isBookmarked;
    await content.save();
    res.json({ isBookmarked: content.isBookmarked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
};

export const updateTags = async (req, res) => {
  try {
    const content = await GeneratedContent.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { tags: req.body.tags },
      { new: true }
    );
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json({ tags: content.tags });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tags' });
  }
};

export const rateContent = async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    const content = await GeneratedContent.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { rating },
      { new: true }
    );
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json({ rating: content.rating });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rating' });
  }
};

export const deleteCase = async (req, res) => {
  try {
    const content = await GeneratedContent.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};
