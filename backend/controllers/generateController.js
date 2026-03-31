import { validationResult } from 'express-validator';
import { generateUPSCContent, getTrendingTopics } from '../config/gemini.js';
import GeneratedContent from '../models/GeneratedContent.js';

export const generate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { topic, gsPaper = 'all', additionalContext = '', language = 'english' } = req.body;

    const aiContent = await generateUPSCContent(topic, gsPaper, additionalContext, language);

    const content = new GeneratedContent({
      userId: req.user.id,
      ...aiContent,
      topic,
      gsPaper,
      language,
    });

    await content.save();
    res.json(content);
  } catch (err) {
    console.error('Generation error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Content generation failed. Please try again.' });
  }
};

export const getTrending = async (req, res) => {
  const { language = 'english' } = req.query;
  try {
    const topics = await getTrendingTopics(language);
    res.json(topics);
  } catch (err) {
    // Fallback topics
    const fallback = language === 'hindi'
      ? [
          { topic: 'Mahila Sashaktikaran', gsPaper: 'GS1', trend: 'hot', reason: 'Laiंgik samanta ke liye mahatvapurna' },
          { topic: 'Jalvayu Parivartan aur Bharat', gsPaper: 'GS3', trend: 'hot', reason: 'COP29 aur Paris Agreement updates' },
          { topic: 'AI Shasan mein Naitikta', gsPaper: 'GS4', trend: 'rising', reason: 'Vaishvik star par AI niyaman ubhar raha hai' },
          { topic: 'Bharat mein Sanghvaad', gsPaper: 'GS2', trend: 'stable', reason: 'Kendr-Rajya sambandh baar baar aata hai' },
          { topic: 'Digital Public Infrastructure', gsPaper: 'GS3', trend: 'hot', reason: 'UPI, ONDC vaishvik model' },
        ]
      : [
          { topic: 'Women Empowerment', gsPaper: 'GS1', trend: 'hot', reason: 'Critical for gender equality discourse' },
          { topic: 'Climate Change & India', gsPaper: 'GS3', trend: 'hot', reason: 'COP29 and Paris Agreement updates' },
          { topic: 'Ethics in AI Governance', gsPaper: 'GS4', trend: 'rising', reason: 'AI regulation emerging globally' },
          { topic: 'Federalism in India', gsPaper: 'GS2', trend: 'stable', reason: 'Centre-State relations frequent theme' },
          { topic: 'Digital Public Infrastructure', gsPaper: 'GS3', trend: 'hot', reason: 'UPI, ONDC global model' },
        ];
    res.json(fallback);
  }
};

export const getDaily = (req, res) => {
  const { language = 'english' } = req.query;

  const topics = language === 'hindi'
    ? [
        'Bharat mein Whistleblower Suraksha',
        'Shahari Sthaniy Nikay aur 74vaan Sanshodhan',
        'Aapda Jokhim Nyunikaran - Sendai Framework',
        'Mahatvapurna Khanij aur Bhu-rajniti',
        'Ek Desh Ek Chunav',
        'MSME Kshetra ki Chunautiyan',
        'Cyber Suraksha Niti',
        'Samajik Audit aur Javabdahi',
      ]
    : [
        'Whistleblower Protection in India',
        'Urban Local Bodies & 74th Amendment',
        'Disaster Risk Reduction - Sendai Framework',
        'Critical Minerals & Geopolitics',
        'One Nation One Election',
        'MSME Sector Challenges',
        'Cyber Security Policy',
        'Social Audit & Accountability',
      ];

  const dayOfYear = Math.floor((Date.now() / 86400000) % topics.length);
  res.json({
    today: topics[dayOfYear],
    suggestions: topics.slice(0, 4),
    language,
  });
};
